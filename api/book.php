<?php
// Agent Rome booking endpoint: custom calendar (date + time) -> real GHL appointment.
// The private token lives ONLY in api/config.local.php, which YOU create in
// Hostinger File Manager (never in git, never in chat). See config.php.
header('Content-Type: application/json');
if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') exit;

function out($arr, $code = 200) { http_response_code($code); echo json_encode($arr); exit; }

$cfg = [];
foreach ([__DIR__ . '/config.local.php', __DIR__ . '/config.php'] as $f) {
  if (is_file($f)) { $c = include $f; if (is_array($c)) $cfg = array_merge($cfg, $c); }
}

$in = json_decode(file_get_contents('php://input'), true);
if (!is_array($in)) $in = [];
$get = function ($k) use ($in) { return trim((string)($in[$k] ?? '')); };

$first = $get('firstName'); $last = $get('lastName'); $email = $get('email');
$biz = $get('businessName'); $service = $get('service'); $notes = $get('notes');
$date = $get('date'); $time = $get('time');

if (!$first || !$last || !$email || !filter_var($email, FILTER_VALIDATE_EMAIL) || !$service) {
  out(['ok' => false, 'code' => 'BAD_INPUT', 'error' => 'Missing required booking details.'], 400);
}
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date) || !preg_match('/^\d{2}:\d{2} (AM|PM)$/', $time)) {
  out(['ok' => false, 'code' => 'BAD_SLOT', 'error' => 'Pick a date and EST time first.'], 400);
}

$token = $cfg['GHL_TOKEN'] ?? '';
$loc = $cfg['GHL_LOCATION_ID'] ?? '';
if (!$token || !$loc || strpos($token, 'REPLACE') !== false || strpos($loc, 'REPLACE') !== false) {
  out(['ok' => false, 'code' => 'NO_CONFIG', 'error' => 'Server booking not configured yet.']);
}

try {
  $tz = new DateTimeZone('America/New_York');
  $start = new DateTime($date . ' ' . $time, $tz);
  $end = clone $start; $end->modify('+30 minutes');
  $startIso = $start->format('Y-m-d\TH:i:sP');
  $endIso = $end->format('Y-m-d\TH:i:sP');
} catch (Exception $e) {
  out(['ok' => false, 'code' => 'BAD_SLOT', 'error' => 'Invalid date/time.'], 400);
}

function ghl($method, $path, $token, $body, $version) {
  $ch = curl_init('https://services.leadconnectorhq.com' . $path);
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST => $method,
    CURLOPT_HTTPHEADER => ['Authorization: Bearer ' . $token, 'Content-Type: application/json', 'Accept: application/json', 'Version: ' . $version],
    CURLOPT_TIMEOUT => 25,
  ]);
  if ($body !== null) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
  $res = curl_exec($ch);
  $http = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);
  return [$http, json_decode($res, true)];
}

// 1) find or create the contact
list($hc, $contact) = ghl('POST', '/contacts/upsert/', $token, [
  'locationId' => $loc,
  'email' => $email,
  'firstName' => $first,
  'lastName' => $last,
  'companyName' => $biz,
], '2021-07-28');
$cid = ($contact['contact']['id'] ?? null) ?: ($contact['id'] ?? null);
if ($hc >= 400 || !$cid) out(['ok' => false, 'code' => 'CONTACT_FAIL', 'error' => 'Could not save contact.'], 502);

// 2) create the appointment (free-slot validation stays ON: clashes are rejected, never double-booked)
$desc = "Service: {$service}\nBusiness: {$biz}\nNotes: {$notes}\nSource: portfolio-booking";
list($ha, $appt) = ghl('POST', '/calendars/events/appointments', $token, [
  'calendarId' => 'H0Uo2pzGDYIGjUUe2ict',
  'locationId' => $loc,
  'contactId' => $cid,
  'startTime' => $startIso,
  'endTime' => $endIso,
  'title' => "30-Minute Teardown — {$first} {$last}",
  'description' => $desc,
  'appointmentStatus' => 'confirmed',
], '2021-04-15');

if ($ha >= 400) {
  $msg = '';
  if (is_array($appt)) { $msg = $appt['message'] ?? ''; }
  $low = strtolower($msg);
  $clash = ($low === '') || strpos($low, 'overlap') !== false || strpos($low, 'busy') !== false
    || strpos($low, 'free') !== false || strpos($low, 'slot') !== false || strpos($low, 'available') !== false;
  out(['ok' => false,
    'code' => $clash ? 'SLOT_TAKEN' : 'APPT_FAIL',
    'error' => $clash ? 'That slot just filled — please pick another time.' : ($msg ?: 'Booking failed.')],
    $clash ? 409 : 502);
}

out(['ok' => true, 'appointmentId' => $appt['id'] ?? null]);
