// Full CONFIG.projects source, copied from the main portfolio.
const PROJECTS = [
    // GHL. 20 projects
        {
          title:"Booking Reminder System",
          category:"GHL",
          img:"customer-booking-ghl.png",
      desc:"GoHighLevel workflow fires multi-channel reminder sequences (email + SMS) at strategic intervals. 24h and 1h before the appointment. all triggered automatically on booking confirmation.",
      problem:"High no-show rates (30%+) for appointments due to lack of timely reminders across channels.",
      solution:"Built a GoHighLevel workflow with multi-channel reminders: 24-hour email + SMS, then 1-hour email + SMS before appointment, all triggered automatically on booking confirmation.",
      result:"Reduced no-show rate by 50%+, recovering thousands in lost revenue monthly."
    },
    {
      title:"Form Response Automation",
      category:"GHL",
      img:"form-response-ghl.png",
      desc:"Instant-response workflow triggered the moment a form is submitted. tags the contact, fires an SMS, then queues a call with automated follow-ups until engagement.",
      problem:"Leads sat untouched for hours after submitting forms, cooling off and dropping before sales could reach them.",
      solution:"GoHighLevel workflow on form submission instantly tags the contact, sends a personalized SMS, waits briefly, then auto-initiates a call task with multi-step follow-up sequences for non-responders.",
      result:"First-touch time cut from hours to under 60 seconds; speed-to-lead drove a sharp lift in contact and conversion rates."
    },
    {
      title:"Intelligent Lead Capture & Real-Time Follow-Up System",
      category:"GHL",
      img:"workflow-lead-capture.png",
      desc:"Real-time GoHighLevel intake system. form submission instantly creates and tags the contact, pushes it to pipeline, fires an SMS, then runs timed email sequences so no lead waits.",
      problem:"Leads came in through forms but got no immediate acknowledgement. Slow, inconsistent follow-ups and scattered tracking let warm prospects go cold before sales could engage.",
      solution:"Rebuilt as a real-time response system: on form submit, GoHighLevel instantly creates and tags the contact, pushes it into the pipeline for visibility, triggers an immediate SMS acknowledgement, then runs a timed email sequence to sustain engagement automatically.",
      result:"Every submission gets an instant response with full pipeline visibility; consistent automated follow-up lifted engagement from first touch to conversion without manual effort."
    },
    {
      title:"Missed Call Recovery & Instant Re-Engagement System",
      category:"GHL",
      img:"missed-call-recovery.png",
      desc:"Real-time GoHighLevel recovery loop that catches every missed call. slight natural delay, instant personalized SMS, lead tagging, assignment, and internal alerts so no opportunity slips.",
      problem:"Missed calls were silently burning revenue. No immediate response meant prospects moved on, while the team had no visibility into how many warm opportunities went unanswered.",
      solution:"Built an instant recovery workflow: on missed call, a brief delay keeps it human, then a personalized SMS fires to the caller while the lead is auto-tagged, assigned to the right team member, and internal notifications trigger. engaging both sides at once.",
      result:"Missed calls turned into active conversations with zero manual effort; full assignment visibility and faster team response times across the board."
    },
    {
      title:"Conversational Sales Assistant & Inquiry Routing System",
      category:"GHL",
      img:"conversational-sales-assistant.png",
      desc:"Conversation driven sales assistant for Messenger. Keyword triggered menu routes each inquiry into tailored paths for pricing, categories, best sellers and ordering in one seamless flow.",
      problem:"Messenger inquiries were unstructured and inconsistent. Simple questions got delayed or vague replies, fragmented journeys and prospects dropped before reaching a buying decision.",
      solution:"Added a keyword triggered entry point with multi path logic. Every message instantly returns a guided menu so users self navigate by intent. Each choice delivers focused pricing, selections, ordering steps or support while keeping a natural conversational flow and easy re engagement.",
      result:"Faster replies, clearer customer journeys and higher conversion from Messenger. Prospects move step by step from inquiry to decision with an organized sales process that runs continuously without manual handling."
    },
    {
      title:"Pipeline Stage Automation Suite",
      category:"GHL",
      img:"multi-stage-lead-automation.png",
      desc:"Complete pipeline automation suite for GoHighLevel. Leads advance on their own through every stage as soon as they book, finish a call or receive a proposal.",
      problem:"Pipeline progress depended on manual CRM updates. Reps had to drag deals between stages after each action which led to missed moves and slow follow up.",
      solution:"Built a suite of connected GoHighLevel workflows that listen for key actions. Booking, call completion and proposal sent. Each event automatically shifts the lead to the right stage without anyone touching the CRM.",
      result:"Pipeline now moves by itself from end to end. No manual updates, cleaner tracking and immediate next step follow up at every stage."
    },
    {
      title:"AI Lead Capture System",
      category:"GHL",
      img:"ai-lead-capture-system.png",
      desc:"Automated GoHighLevel system that captures every inquiry instantly, qualifies and segments leads with AI assisted messaging and routes high intent prospects to sales in real time.",
      problem:"Website inquiries were leaking away. Slow replies, manual handling and messy CRM processes meant visitors never got a follow up fast enough and hot leads went cold before sales could engage.",
      solution:"Built an automated GoHighLevel capture engine that fires the moment an inquiry lands. Sends AI assisted SMS and email replies, qualifies against preset rules, auto tags and segments inside the CRM and instantly routes high intent leads to the sales team.",
      result:"Response time collapsed to seconds, lead to appointment conversion climbed and the business now runs a scalable system that grows revenue while cutting manual workload."
    },
    {
      title:"SMS Appointment Reminder System",
      category:"GHL",
      img:"sms-appointment-reminder.png",
      desc:"Multi channel reminder automation synced to the calendar. Sends SMS and email at 24 hours and 1 hour before each appointment so clients never miss a slot.",
      problem:"No shows were draining revenue and wasting staff time. Manual reminders were patchy, clients forgot appointments and the experience felt unreliable.",
      solution:"Created a calendar synced automation that triggers 24 hour SMS plus email reminders and again at 1 hour before the appointment. Every booking gets consistent multi channel nudges without anyone having to remember to send them.",
      result:"No show rate fell by over 50 percent, lost revenue was recovered, operations ran smoother and clients experienced a more professional reliable service."
    },
    {
      title:"Smart SMS Lead Nurturer",
      category:"GHL",
      img:"smart-sms-lead-nurturer.png",
      desc:"Responsive GoHighLevel SMS nurturer with dual triggers and conditional branching. Detects INTERESTED replies and timeouts to route every lead down the right follow up path automatically.",
      problem:"SMS follow ups were one size fits all. Without logic based on what prospects actually replied or when, many warm leads slipped through with no personalized next step.",
      solution:"Built a GoHighLevel workflow with two triggers for contact reply and timeout plus conditional branching for INTERESTED responses. Each path auto routes to the right sequence so timing and message match the prospect's intent.",
      result:"Engagement lifted sharply with personalized nurture and cold leads were reactivated. A 45 percent jump in response rate and more conversations booked without manual chasing."
    },
    {
      title:"Progressive Appointment Reminder Flow",
      category:"GHL",
      img:"appointment-reminder-flow.png",
      desc:"Escalating reminder system that builds urgency over time. Confirmation at booking then email and SMS at 24 hours, 1 hour and 5 minutes before the appointment for maximum visibility.",
      problem:"The issue was not getting bookings but getting people to show up. Single emails were ignored and reminders sent too far from the appointment time failed to prevent last minute no shows.",
      solution:"Implemented timed reminders at key decision points. 24 hours, 1 hour and 5 minutes before the slot, stacking email first then email plus SMS as urgency rises, with a short delay trigger for a precise last minute nudge.",
      result:"Missed appointments dropped, reminder engagement increased and scheduling became far more predictable and efficient across the team."
    },
    {
      title:"Application Submitted Handler",
      category:"GHL",
      img:"application-submitted-handler.png",
      desc:"Instant GoHighLevel handler that fires on form submission. Updates custom fields, advances the opportunity, confirms by SMS and alerts the team in real time.",
      problem:"Applicants submitted forms but nothing happened automatically. Records stayed outdated, pipeline stages never moved and the team had no signal that a new application needed attention.",
      solution:"Built a GoHighLevel workflow triggered on form submission that updates custom fields, moves the opportunity to Application Submitted, sends an immediate SMS confirmation and fires an internal notification so ownership is clear.",
      result:"Applications process instantly with real time team alerts and accurate pipeline updates. No manual entry, no missed follow ups and faster time to review."
    },
    {
      title:"Application Approval Flow",
      category:"GHL",
      img:"application-approval-flow.png",
      desc:"Status triggered GoHighLevel flow that handles approvals end to end. Opportunity updates to Approved then approval SMS and email fire automatically on decision change.",
      problem:"Approved applications got stuck waiting on manual work. Someone had to update the status, type an SMS and send an email, which delayed onboarding and created inconsistent follow through.",
      solution:"Built a GoHighLevel workflow on Decision Status change that updates the opportunity to Approved, sends an instant approval SMS and follows with an approval email, all executed automatically the moment the status flips.",
      result:"Approvals now notify instantly across SMS and email, onboarding time shrinks and every approved applicant gets a consistent on time welcome without manual steps."
    },
    {
      title:"Application Decline Flow",
      category:"GHL",
      img:"application-decline-flow.png",
      desc:"Thoughtful GoHighLevel decline flow that closes the loop gracefully. Triggers on pipeline stage change and delivers a clear, empathetic SMS with next steps.",
      problem:"Declined applicants heard nothing after a decision. Silence created confusion, hurt trust and left the brand looking unprofessional at a sensitive moment.",
      solution:"Built a GoHighLevel workflow that watches for a pipeline stage change to Declined, updates the opportunity status and immediately sends a professional decline SMS that explains next steps with empathy.",
      result:"Every decline is handled consistently and kindly. Brand reputation stays intact and applicants get clarity without anyone needing to send manual messages."
    },
    {
      title:"Document Upload Checker",
      category:"GHL",
      img:"document-upload-checker.png",
      desc:"GoHighLevel verification workflow that gates review until files are in. Checks uploads and decision status, then advances the opportunity, updates fields and pings the team.",
      problem:"There was no reliable way to confirm required documents arrived. Incomplete applications lingered in limbo, review was delayed and staff wasted time chasing files manually.",
      solution:"Built a conditional GoHighLevel workflow that checks if documents are uploaded and the decision is still pending. When both are true it moves the opportunity to Under Review, updates custom fields and sends an SMS team alert. If conditions are not met the workflow exits cleanly.",
      result:"Only complete applications reach review. Verification runs automatically, the pipeline stays accurate and the team is notified the moment an application is truly ready."
    },
    {
      title:"New Lead Application Sender",
      category:"GHL",
      img:"new-lead-application-sender.png",
      desc:"GoHighLevel outreach flow that engages new leads instantly. Sends the application link by SMS and email, tags the contact and advances the opportunity without delay.",
      problem:"New leads entered the pipeline but waited too long for an application link. That gap caused drop off before prospects could even start the application.",
      solution:"Built a GoHighLevel workflow triggered when pipeline stage becomes New Lead. It immediately sends an SMS with the application link, follows with a welcome email, updates the contact field to Application Link Sent and moves the opportunity forward.",
      result:"New leads get instant multi channel outreach and time to application collapses. Fewer drop offs and a steadier flow of started applications."
    },
    {
      title:"Application Reminder Ladder",
      category:"GHL",
      img:"application-reminder-ladder.png",
      desc:"Multi step GoHighLevel reminder ladder that never lets an applicant slip away. Timed checks and escalating SMS nudges recover unfinished applications before the opportunity auto closes.",
      problem:"Applicants received the link but many never submitted. Without systematic follow up they simply forgot and the opportunity sat idle with no clear close out.",
      solution:"Built a laddered GoHighLevel workflow that waits 2 hours then checks if the application was submitted. If not it sends SMS reminder one, waits again and checks, then reminder two, waits again, then reminder three. If still not submitted it closes the opportunity as No Response.",
      result:"Incomplete applications recover at a much higher rate. More than 40 percent are re engaged before auto close, keeping the pipeline clean and active."
    },
    {
      title:"Smart Review Routing & Reputation Control System",
      category:"GHL",
      img:"smart-review-routing.png",
      desc:"Intelligent GoHighLevel feedback router that turns every rating into the right next step. One SMS for a 1 to 5 score, then conditional logic sends happy clients to public reviews and unhappy clients to private resolution.",
      problem:"Feedback was unmanaged. Generic review requests pushed unhappy experiences into public view while many satisfied clients never left a review, keeping volume low and reputation inaccurate.",
      solution:"Built a two step control workflow. A tagged contact receives an SMS asking for a quick 1 to 5 rating. Low scores trigger a private follow up to resolve concerns and capture internal feedback. High scores redirect instantly to a public review. If no reply in 48 hours a second SMS retries the same routing automatically.",
      result:"A controlled feedback loop that steadily grows high quality public reviews while containing negative experiences privately. Stronger reputation, clearer customer insight and a fully automated system with no manual chasing."
    },
    {
      title:"Database Reactivation & Offer Conversion System",
      category:"GHL",
      img:"database-reactivation-system.png",
      desc:"Targeted GoHighLevel reactivation flow that revives dormant contacts with voucher offers and intent based routing. Short response windows and a second offer maximize re engagement automatically.",
      problem:"The existing database sat idle as a passive asset. Past interest was never re engaged, campaigns had no follow up logic and cold contacts rarely returned without a timely relevant incentive.",
      solution:"Built a two layer outreach strategy. Trigger sends an initial SMS voucher to spark engagement. A positive reply within the window routes straight to booking. No reply auto sends a stronger second offer. Each response is read for intent so the workflow either moves the lead forward or exits gracefully with a low pressure close.",
      result:"Cold leads consistently reactivate into active opportunities. Higher engagement, more conversions and a database that now drives revenue on autopilot without manual effort."
    },
    {
      title:"Vendor Lead Gen",
      category:"GHL",
      img:"vendor-lead-gen.png",
      desc:"Segment branched GoHighLevel lead gen workflow for financial services. Routes each vendor type through tailored outreach across the full Florida database automatically.",
      problem:"Reaching equipment financing and credit brokers in Florida with one generic blast failed to resonate. Each vendor segment needed its own message to convert.",
      solution:"Built a GoHighLevel lead gen workflow that branches outreach by vendor segment across the target list. Each path delivers segment specific messaging instead of a single blanket campaign.",
      result:"Personalized outreach now runs automatically across the entire vendor database with higher relevance and better response by segment."
    },
    {
      title:"IVR Call Routing System",
      category:"GHL",
      img:"ivr-call-routing-system.png",
      desc:"Department aware GoHighLevel IVR that greets callers with Press 1 for Sales or Press 2 for Installations and Services. Routes instantly to the right team and auto recovers missed calls.",
      problem:"Every inquiry hit a single line. Sales, service and installation calls mixed together, causing transfers, long waits and missed opportunities when the right person was not available.",
      solution:"Configured a GoHighLevel IVR menu to route by intent. Sales connects to sales, installation and service to operations. Unanswered calls go to the correct voicemail and trigger a missed call sequence with SMS follow up so no inquiry is lost.",
      result:"A more organized and professional call experience with less redirecting, faster connection to the right department and automatic follow up for every missed inquiry from the first call onward."
    },

    // Zapier. 5 projects
    {
      title:"Email Attachment Pipeline",
      category:"Zapier",
      img:"zapier-email-attachment-pipeline.png",
      desc:"Zapier flow that never loses a file again. Watches Gmail for attachments, filters by rules, uploads to Google Drive and pings Slack instantly.",
      problem:"Important attachments were buried in inboxes. Someone had to download and file each one by hand into shared drives and files still went missing.",
      solution:"Built a Zapier automation that watches Gmail for new attachments, filters by criteria, uploads matching files to Google Drive in the right folder and sends a Slack notification so the team knows right away.",
      result:"Zero lost attachments. Every file is auto organized in Google Drive with instant team alerts and no manual filing."
    },
    {
      title:"Shopify Fraud & Inventory Monitor",
      category:"Zapier",
      img:"zapier-shopify-fraud-inventory.png",
      desc:"Zapier fraud and inventory guard that watches every Shopify order, checks Sheets and routes risk instantly to Slack or the sheet for next action.",
      problem:"Ecommerce teams lost time and money manually monitoring flagged Shopify orders, cross checking inventory logs and updating tracking sheets or setting reminders. Risk slipped through late.",
      solution:"Built a Zapier flow triggered when Shopify flags an order as high risk. Formatter cleans the payload, a Sheets lookup finds the item record and conditional paths split dynamically. Path D sends targeted Slack reminders for immediate review, Path A updates the sheet row and applies strict filters for further processing.",
      result:"Suspicious orders get instant response to prevent chargebacks and fulfillment errors. Shopify, Sheets and Slack stay synced automatically and 10 to 15 hours per week of manual review is saved."
    },
    {
      title:"Daily Task Automation Workflow",
      category:"Zapier",
      img:"zapier-daily-task-automation.png",
      desc:"Zapier daily scheduler that compiles todays Asana assignments and emails the summary via Gmail. Morning plan delivers itself.",
      problem:"Compiling and emailing daily task assignments by hand was a recurring drain that pulled ops time every morning.",
      solution:"Built a daily Zapier schedule that pulls the days Asana tasks and sends the assignment summary through Gmail so everyone starts aligned without manual compiling.",
      result:"The teams daily plan now lands in inboxes automatically every morning with no manual work."
    },
    {
      title:"Sales Alert Autopilot",
      category:"Zapier",
      img:"zapier-sales-alert-autopilot.png",
      desc:"Zapier alert engine that enriches every lead and routes by priority. High priority hits Sheets and Slack with an AI drafted email while low priority gets a Gmail notice.",
      problem:"Hot leads sat unnoticed while enrichment and triage happened by hand. By the time someone looked the opportunity had cooled.",
      solution:"Built a Zapier flow from lead webhook through Apollo enrichment into priority Paths. High priority leads log to Sheets, ping Slack and trigger an AI drafted email. Low priority leads receive a Gmail notice so nothing is ignored but focus stays on hot prospects.",
      result:"High priority leads trigger an instant enriched AI drafted alert. Nothing hot goes cold and sales sees the right lead at the right time."
    },
    {
      title:"Spreadsheet Event Scheduler",
      category:"Zapier",
      img:"zapier-spreadsheet-event-scheduler.png",
      desc:"Zapier scheduler that turns sheet rows into calendar events instantly. Watches Sheets, creates Google Calendar events and notifies Slack.",
      problem:"Events entered in spreadsheets never reached team calendars. Conflicts and missed events piled up because calendars stayed out of sync.",
      solution:"Built a Zapier flow that watches Google Sheets for new or updated rows, creates detailed Google Calendar events and sends a Slack channel notification so the team knows right away.",
      result:"Zero missed events. Every spreadsheet entry syncs instantly to calendars with team alerts and scheduling stays conflict free."
    },
    {
      title:"Asana to CRM Lead Engagement",
      category:"Zapier",
      img:"assets/project-previews/zapier-asana-crm-lead-engagement.png",
      desc:"Multi stage Zapier workflow that ties Asana, Gmail, Drive and AI together. Task status drives branch logic, folders, quotes, follow ups and closing emails without manual handoffs.",
      problem:"Teams burned hours updating task statuses, sending follow ups, creating folders and drafting client updates across scattered project stages. Handoffs were missed and prospects went cold.",
      solution:"Built a Zapier flow triggered on Asana task updates with multi branch routing by project status. Ready to Start creates Drive folders and Asana subtasks. No Response and Quoted send Gmail outreach and quotes, wait with timed delays, check response filters and run follow up sequences. Approved uses AI by Zapier to extract details, pull files from Drive and send confirmations. Paid and Closed use AI to generate executive summaries and send closing emails via Gmail.",
      result:"End to end sales and fulfillment is standardized with zero manual handoffs. Quotes and unresponsive prospects get timely follow ups automatically and ops saves 15 to 20 hours per week on tracking, documents and email admin."
    },
    {
      title:"Client & Task Management Workflow",
      category:"Zapier",
      img:"zapier-client-task-management.png",
      desc:"Zapier onboarding flow that fires the instant a client signs up. Paths create the record, assign tasks and notify Slack so nothing is forgotten.",
      problem:"New client onboarding was a scattered manual checklist that was easy to miss when the team was busy, leaving steps incomplete.",
      solution:"Built a Zapier workflow with Paths that routes each new client automatically. Creates the client record, assigns the right tasks and pings the team in Slack for ownership and next steps.",
      result:"Onboarding now triggers instantly on signup with every step covered. No forgotten tasks and a consistent start for every client."
    },

    // Make.com. 5 projects
    {
      title:"Lead Capture & CRM Sync",
      category:"Make.com",
      img:"make-lead-capture-crm-sync.png",
      desc:"Make.com lead routing that scores every prospect, syncs records instantly and alerts sales the moment a high value lead lands.",
      problem:"Sales ops wasted hours sorting inbound leads, cross checking databases, updating CRMs and pinging reps by hand. Slow follow up meant high value prospects slipped away before anyone could respond.",
      solution:"Built a Make.com scenario that captures payloads via Webhook and standardizes variables, then routes with intelligent logic across three paths. High priority leads above 70 score log to Airtable, sync to HubSpot, notify Slack and fire Gmail outreach. Standard leads below 70 record to Airtable, update HubSpot and send standard Slack and Gmail follow ups. Invalid data flags instantly to a dedicated Slack channel for review.",
      result:"High priority prospects get instant speed to lead with zero routing delay. Airtable, HubSpot, Slack and Gmail stay perfectly in sync and manual distribution work drops by 12 to 18 hours every week."
    },
    {
      title:"Social Media Update Automation",
      category:"Make.com",
      img:"make-social-media-automation.png",
      desc:"Make.com automation that turns a single sheet row into a live post and a logged result. Slack plus Facebook Page publish then writes status back automatically.",
      problem:"Posting updates across channels and tracking what actually published was repetitive manual work that ate time every week.",
      solution:"Built a Make.com flow triggered by a new Google Sheets row. It creates a Slack message, publishes to Facebook Page and then writes the publish status back to the sheet so the log stays accurate without copy paste.",
      result:"Scheduled updates publish and self report with no manual posting. The sheet stays current and the social queue runs on autopilot."
    },
    {
      title:"Multi-Message Slack Router",
      category:"Make.com",
      img:"make-multi-message-slack-router.png",
      desc:"Make.com router that fans a single sheet row into sequential Slack delivery. One input automatically notifies every relevant channel in the right order.",
      problem:"Sending the right update to the right Slack channels by hand was repetitive and easy to get wrong. Messages were missed or posted to the wrong place.",
      solution:"Built a Make.com flow triggered by a new Google Sheets row that feeds a Router. Each route delivers the message to a specific Slack channel in sequence so coverage is complete without manual copy paste.",
      result:"One row now notifies every relevant channel automatically and in order. No manual routing and no missed audiences."
    },
    {
      title:"Automated Facebook Page Posting",
      category:"Make.com",
      img:"make-facebook-page-posting.png",
      desc:"Make.com content flow that publishes from Sheets to Facebook Page, alerts Slack and logs the result back to the row. Calendar drives itself.",
      problem:"Scheduling Facebook posts by hand and tracking what published was slow and easy to lose control of. Content gaps and duplicate posts crept in.",
      solution:"Built a Make.com scenario that pulls content from Google Sheets, publishes to Facebook Page, notifies Slack and then updates the sheet row with the publish result for full traceability.",
      result:"A content calendar in Sheets now publishes itself and logs every outcome. No manual scheduling and no lost posts."
    },
    {
      title:"Xero Transaction Sync",
      category:"Make.com",
      img:"make-xero-transaction-sync.png",
      desc:"Make.com finance sync that bridges Xero, Sheets and Asana. A completed Asana task triggers export, then router and iterator sync every transaction automatically.",
      problem:"Reconciling Xero transactions into working sheets and tasks required tedious rekeying. Manual copy created delays and errors across finance ops.",
      solution:"Built a Make.com flow where a completed Asana task triggers a Xero export. A router and iterator then process each transaction and sync results to Google Sheets and back to Asana for full alignment.",
      result:"Financial data stays in sync across Xero, Sheets and Asana with no manual re entry. Reconciliation stays accurate and hands free."
    },
    {
      title:"Gmail AI Integration",
      category:"Make.com",
      img:"make-gmail-ai-integration.png",
      desc:"Make.com inbox automation that puts AI in the loop end to end. Watches Gmail, parses with Gemini, stores to Drive, logs to Sheets and sends the reply.",
      problem:"Every incoming email needed reading, filing, logging and a reply, all done manually. Inbox work piled up and responses were slow.",
      solution:"Built a Make.com flow that watches Gmail and runs each message through Gemini. Files land in Google Drive, structured data logs to Google Sheets and an AI drafted reply sends automatically.",
      result:"Complete email handling from parse to store to log to respond now runs with AI. Inbox turns over automatically without manual touches."
    },

    // n8n. 5 projects
    {
      title:"Facebook Messenger AI Agent",
      category:"n8n",
      img:"n8n-facebook-messenger-ai-agent.png",
      desc:"n8n AI agent inside Messenger that understands intent, answers from a Docs knowledge base and logs smart notes while remembering past context.",
      problem:"Teams lost hours repeating answers, losing chat context and missing messages after hours. Routine questions piled up and follow ups were missed.",
      solution:"Built an n8n flow where users chat on Messenger normally. Gemini interprets intent and generates replies, Google Docs serves as knowledge base and memory store, and the agent remembers prior conversations while updating records automatically.",
      result:"Instant 24/7 responses handle most routine questions without human help and save 12 to 25 hours per week on support and note taking."
    },
    {
      title:"Automated Email Outreach",
      category:"n8n",
      img:"n8n-automated-email-outreach.png",
      desc:"n8n outreach engine that personalizes cold email at volume. Hourly Sheets pull, AI per sector, Outlook send and status logged back automatically.",
      problem:"Personalizing cold emails at volume was slow and there was no clean record of what actually sent, making follow up messy.",
      solution:"Built an n8n flow that pulls from Google Sheets hourly, uses AI to personalize per sector, sends via Outlook and logs sent or failed status back to the sheet for tracking.",
      result:"High volume personalized outreach now runs on autopilot with full delivery tracking and no manual send log."
    },
    {
      title:"AI Agent",
      category:"n8n",
      img:"n8n-ai-agent.png",
      desc:"Reusable n8n AI brain any app can hit via webhook. Gemini reasoning plus conversation memory and HTTP tool calls for context aware responses.",
      problem:"Apps needed a flexible AI endpoint that could reason and call tools, not a rigid single purpose script that breaks on every new use case.",
      solution:"Built a webhook triggered n8n agent with Gemini, conversation memory and HTTP tool calls. It fetches context on demand and responds intelligently to the caller.",
      result:"A drop in AI brain reused as the core of multiple client builds. One endpoint powers many apps without rebuilding logic each time."
    },
    {
      title:"AI Sales Agent",
      category:"n8n",
      img:"n8n-ai-sales-agent.png",
      desc:"n8n sales agent that never drops a follow up. Loads leads from Sheets and runs AI first, second and third touch sequences with memory while writing status back.",
      problem:"Reps forgot follow ups and warm leads went cold before the second or third touch, leaving pipeline value on the table.",
      solution:"Built an n8n flow that loads leads from Google Sheets and runs AI first, second and third touch email sequences with conversation memory, updating each status back to the sheet so tracking stays automatic.",
      result:"Every lead gets consistent personalized multi touch follow up with no dropped follow ups and no manual tracking."
    },
    {
      title:"AI Customer Support Automation",
      category:"n8n",
      img:"n8n-ai-customer-support.png",
      desc:"n8n support flow that answers repetitive email instantly. Gmail trigger, Gemini classification and an AI agent that drafts and sends context aware replies.",
      problem:"Repetitive support emails piled up and dragged response times down. The team was stuck answering the same questions again and again.",
      solution:"Built an n8n flow with Gmail trigger. Gemini classifies each email, an AI agent drafts a context aware reply, then the message auto sends and is labeled for traceability.",
      result:"Routine tickets are answered instantly with no human review. The team only handles genuine edge cases and response time collapses."
    },
    {
      title:"Lead Capture to AI Qualification to GoHighLevel",
      category:"n8n",
      img:"n8n-lead-capture-ai-qualification-ghl.png",
      desc:"n8n automation that captures raw webhook leads, deduplicates GoHighLevel and routes only AI qualified prospects into the pipeline as opportunities.",
      problem:"Sales teams lost response time and cluttered the CRM with duplicates while manually copying, qualifying and creating opportunities for every new lead.",
      solution:"Built an n8n flow that ingests webhooks and standardizes contact formatting, searches GoHighLevel to check for existing contacts, runs details through an LLM Chain via OpenRouter for intent and quality scoring, then issues an HTTP request to create a fully qualified opportunity directly inside GoHighLevel.",
      result:"Instant lead to opportunity creation with no manual entry or duplicate records. Every incoming lead gets standardized AI scoring and the team saves 12 to 20 hours per week on CRM admin and triage."
    },
    {
      title:"RAG Forge Knowledge Automation",
      category:"n8n",
      img:"n8n-rag-forge-knowledge.png",
      desc:"n8n retrieval workflow that keeps AI knowledge bases live. Drive changes trigger vector cleanup, embedding and Supabase sync for hallucination free answers.",
      problem:"Knowledge bases went stale whenever handbook documents changed. HR answered the same policy questions manually and wasted time re indexing files, while AI gave outdated answers.",
      solution:"Built an n8n flow that monitors Google Drive in real time for creates, updates and deletes. It deletes outdated vectors in Supabase when files are revised, downloads updated files, generates fresh embeddings via OpenAI with a data loader and updates the Supabase Vector Store so retrieval stays synchronized.",
      result:"Guarantees accurate hallucination free AI responses with live file sync. No manual vector maintenance and 10 to 15 hours per week saved on document management and routine inquiries."
    },
    {
      title:"Cross-System Intelligence",
      category:"n8n",
      img:"n8n-cross-system-intelligence.png",
      desc:"n8n AI layer that unifies HubSpot, Sheets, Telegram and Gmail. Webhook payloads are validated, scored by OpenAI and routed across 4 paths for instant triage.",
      problem:"Teams wasted hours sorting inbound business data, triaging high risk issues and copy pasting details across CRMs, sheets and chat channels with constant human error.",
      solution:"Built an n8n flow that ingests live payloads via Webhook Trigger and validates data, uses OpenAI to evaluate sentiment, churn risk, deal value and context, parses decisions and routes across 4 specialized paths for High Value, Risk, Additional Info and Default, then upserts HubSpot contacts, appends full records to Google Sheets, sends targeted Telegram alerts and drafts executive summaries in Gmail.",
      result:"Real time lead triage and risk alerts reach the right team instantly. HubSpot, Sheets, Telegram and Gmail stay fully synchronized and 15 to 25 hours per week of admin and reporting is saved."
    },
    {
      title:"RAG Pipeline & AI Chatbot",
      category:"n8n",
      img:"n8n-rag-pipeline-chatbot.png",
      desc:"n8n RAG stack that turns every Drive upload into instant answers. Files embed via OpenAI into Pinecone and a chat agent serves sourced replies.",
      problem:"Answers were buried across scattered documents no one had time to search, slowing support and creating inconsistent replies.",
      solution:"Built an n8n flow where a Google Drive upload triggers ingestion, OpenAI generates embeddings that land in Pinecone and a chat agent answers directly from that knowledge base with sources.",
      result:"Instant sourced answers on demand and the knowledge base re indexes itself every time a file is dropped in with no manual maintenance."
    },
    {
      title:"Lead Temperature Router",
      category:"n8n",
      img:"n8n-lead-temperature-router.png",
      desc:"n8n triage flow that scores every form submission as Cold, Warm or Hot via Switch and appends instantly to the matching Google Sheet for tailored follow up.",
      problem:"New leads needed routing by intent but manual triage was slow and inconsistent. Hot prospects cooled while reps guessed who to contact first.",
      solution:"Built an n8n flow triggered on form submission that scores intent through a Switch. Cold leads for awareness, Warm for nurturing and Hot for immediate sales action are appended to their matching Google Sheet automatically.",
      result:"Every lead is triaged and routed the instant it arrives with no manual sorting. Outreach matches intent from first touch."
    },
    {
      title:"Invoice Follow-Up System",
      category:"n8n",
      img:"n8n-invoice-follow-up.png",
      desc:"n8n finance flow that chases overdue invoices on autopilot. Daily Sheets read tiers by days overdue and escalates Gmail reminders with internal alerts.",
      problem:"Chasing overdue invoices by hand was awkward, inconsistent and easy to forget. Late payments slipped past without systematic follow up.",
      solution:"Built an n8n flow with a daily Sheets read. Invoices are tiered by days overdue, escalating Gmail reminders send automatically and internal alerts trigger at 30 plus days so nothing is missed.",
      result:"Overdue invoices chase themselves with no manual follow up. Nothing slips past 30 days unnoticed and cash flow stays consistent."
    }
  ].map(p=>({...p,img:"../"+p.img}));
