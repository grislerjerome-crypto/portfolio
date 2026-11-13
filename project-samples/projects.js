const PROJECTS = [
  {
    "title": "Booking Reminder System",
    "category": "GHL",
    "img": "../customer-booking-ghl.png",
    "desc": "GoHighLevel workflow fires multi-channel reminder sequences (email + SMS) at strategic intervals. 24h and 1h before the appointment. all triggered automatically on booking confirmation.",
    "solution": "Built a GoHighLevel workflow with multi-channel reminders: 24-hour email + SMS, then 1-hour email + SMS before appointment, all triggered automatically on booking confirmation."
  },
  {
    "title": "Form Response Automation",
    "category": "GHL",
    "img": "../form-response-ghl.png",
    "desc": "Instant-response workflow triggered the moment a form is submitted. tags the contact, fires an SMS, then queues a call with automated follow-ups until engagement.",
    "solution": "GoHighLevel workflow on form submission instantly tags the contact, sends a personalized SMS, waits briefly, then auto-initiates a call task with multi-step follow-up sequences for non-responders."
  },
  {
    "title": "Intelligent Lead Capture & Real-Time Follow-Up System",
    "category": "GHL",
    "img": "../workflow-lead-capture.png",
    "desc": "Real-time GoHighLevel intake system. form submission instantly creates and tags the contact, pushes it to pipeline, fires an SMS, then runs timed email sequences so no lead waits.",
    "solution": "Rebuilt as a real-time response system: on form submit, GoHighLevel instantly creates and tags the contact, pushes it into the pipeline for visibility, triggers an immediate SMS acknowledgement, then runs a timed email sequence to sustain engagement automatically."
  },
  {
    "title": "Missed Call Recovery & Instant Re-Engagement System",
    "category": "GHL",
    "img": "../missed-call-recovery.png",
    "desc": "Real-time GoHighLevel recovery loop that catches every missed call. slight natural delay, instant personalized SMS, lead tagging, assignment, and internal alerts so no opportunity slips.",
    "solution": "Built an instant recovery workflow: on missed call, a brief delay keeps it human, then a personalized SMS fires to the caller while the lead is auto-tagged, assigned to the right team member, and internal notifications trigger. engaging both sides at once."
  },
  {
    "title": "Conversational Sales Assistant & Inquiry Routing System",
    "category": "GHL",
    "img": "../conversational-sales-assistant.png",
    "desc": "Conversation driven sales assistant for Messenger. Keyword triggered menu routes each inquiry into tailored paths for pricing, categories, best sellers and ordering in one seamless flow.",
    "solution": "Added a keyword triggered entry point with multi path logic. Every message instantly returns a guided menu so users self navigate by intent. Each choice delivers focused pricing, selections, ordering steps or support while keeping a natural conversational flow and easy re engagement."
  },
  {
    "title": "Pipeline Stage Automation Suite",
    "category": "GHL",
    "img": "../multi-stage-lead-automation.png",
    "desc": "Complete pipeline automation suite for GoHighLevel. Leads advance on their own through every stage as soon as they book, finish a call or receive a proposal.",
    "solution": "Built a suite of connected GoHighLevel workflows that listen for key actions. Booking, call completion and proposal sent. Each event automatically shifts the lead to the right stage without anyone touching the CRM."
  },
  {
    "title": "AI Lead Capture System",
    "category": "GHL",
    "img": "../ai-lead-capture-system.png",
    "desc": "Automated GoHighLevel system that captures every inquiry instantly, qualifies and segments leads with AI assisted messaging and routes high intent prospects to sales in real time.",
    "solution": "Built an automated GoHighLevel capture engine that fires the moment an inquiry lands. Sends AI assisted SMS and email replies, qualifies against preset rules, auto tags and segments inside the CRM and instantly routes high intent leads to the sales team."
  },
  {
    "title": "SMS Appointment Reminder System",
    "category": "GHL",
    "img": "../sms-appointment-reminder.png",
    "desc": "Multi channel reminder automation synced to the calendar. Sends SMS and email at 24 hours and 1 hour before each appointment so clients never miss a slot.",
    "solution": "Created a calendar synced automation that triggers 24 hour SMS plus email reminders and again at 1 hour before the appointment. Every booking gets consistent multi channel nudges without anyone having to remember to send them."
  },
  {
    "title": "Smart SMS Lead Nurturer",
    "category": "GHL",
    "img": "../smart-sms-lead-nurturer.png",
    "desc": "Responsive GoHighLevel SMS nurturer with dual triggers and conditional branching. Detects INTERESTED replies and timeouts to route every lead down the right follow up path automatically.",
    "solution": "Built a GoHighLevel workflow with two triggers for contact reply and timeout plus conditional branching for INTERESTED responses. Each path auto routes to the right sequence so timing and message match the prospect's intent."
  },
  {
    "title": "Progressive Appointment Reminder Flow",
    "category": "GHL",
    "img": "../appointment-reminder-flow.png",
    "desc": "Escalating reminder system that builds urgency over time. Confirmation at booking then email and SMS at 24 hours, 1 hour and 5 minutes before the appointment for maximum visibility.",
    "solution": "Implemented timed reminders at key decision points. 24 hours, 1 hour and 5 minutes before the slot, stacking email first then email plus SMS as urgency rises, with a short delay trigger for a precise last minute nudge."
  },
  {
    "title": "Application Submitted Handler",
    "category": "GHL",
    "img": "../application-submitted-handler.png",
    "desc": "Instant GoHighLevel handler that fires on form submission. Updates custom fields, advances the opportunity, confirms by SMS and alerts the team in real time.",
    "solution": "Built a GoHighLevel workflow triggered on form submission that updates custom fields, moves the opportunity to Application Submitted, sends an immediate SMS confirmation and fires an internal notification so ownership is clear."
  },
  {
    "title": "Application Approval Flow",
    "category": "GHL",
    "img": "../application-approval-flow.png",
    "desc": "Status triggered GoHighLevel flow that handles approvals end to end. Opportunity updates to Approved then approval SMS and email fire automatically on decision change.",
    "solution": "Built a GoHighLevel workflow on Decision Status change that updates the opportunity to Approved, sends an instant approval SMS and follows with an approval email, all executed automatically the moment the status flips."
  },
  {
    "title": "Application Decline Flow",
    "category": "GHL",
    "img": "../application-decline-flow.png",
    "desc": "Thoughtful GoHighLevel decline flow that closes the loop gracefully. Triggers on pipeline stage change and delivers a clear, empathetic SMS with next steps.",
    "solution": "Built a GoHighLevel workflow that watches for a pipeline stage change to Declined, updates the opportunity status and immediately sends a professional decline SMS that explains next steps with empathy."
  },
  {
    "title": "Document Upload Checker",
    "category": "GHL",
    "img": "../document-upload-checker.png",
    "desc": "GoHighLevel verification workflow that gates review until files are in. Checks uploads and decision status, then advances the opportunity, updates fields and pings the team.",
    "solution": "Built a conditional GoHighLevel workflow that checks if documents are uploaded and the decision is still pending. When both are true it moves the opportunity to Under Review, updates custom fields and sends an SMS team alert. If conditions are not met the workflow exits cleanly."
  },
  {
    "title": "New Lead Application Sender",
    "category": "GHL",
    "img": "../new-lead-application-sender.png",
    "desc": "GoHighLevel outreach flow that engages new leads instantly. Sends the application link by SMS and email, tags the contact and advances the opportunity without delay.",
    "solution": "Built a GoHighLevel workflow triggered when pipeline stage becomes New Lead. It immediately sends an SMS with the application link, follows with a welcome email, updates the contact field to Application Link Sent and moves the opportunity forward."
  },
  {
    "title": "Application Reminder Ladder",
    "category": "GHL",
    "img": "../application-reminder-ladder.png",
    "desc": "Multi step GoHighLevel reminder ladder that never lets an applicant slip away. Timed checks and escalating SMS nudges recover unfinished applications before the opportunity auto closes.",
    "solution": "Built a laddered GoHighLevel workflow that waits 2 hours then checks if the application was submitted. If not it sends SMS reminder one, waits again and checks, then reminder two, waits again, then reminder three. If still not submitted it closes the opportunity as No Response."
  },
  {
    "title": "Smart Review Routing & Reputation Control System",
    "category": "GHL",
    "img": "../smart-review-routing.png",
    "desc": "Intelligent GoHighLevel feedback router that turns every rating into the right next step. One SMS for a 1 to 5 score, then conditional logic sends happy clients to public reviews and unhappy clients to private resolution.",
    "solution": "Built a two step control workflow. A tagged contact receives an SMS asking for a quick 1 to 5 rating. Low scores trigger a private follow up to resolve concerns and capture internal feedback. High scores redirect instantly to a public review. If no reply in 48 hours a second SMS retries the same routing automatically."
  },
  {
    "title": "Database Reactivation & Offer Conversion System",
    "category": "GHL",
    "img": "../database-reactivation-system.png",
    "desc": "Targeted GoHighLevel reactivation flow that revives dormant contacts with voucher offers and intent based routing. Short response windows and a second offer maximize re engagement automatically.",
    "solution": "Built a two layer outreach strategy. Trigger sends an initial SMS voucher to spark engagement. A positive reply within the window routes straight to booking. No reply auto sends a stronger second offer. Each response is read for intent so the workflow either moves the lead forward or exits gracefully with a low pressure close."
  },
  {
    "title": "Vendor Lead Gen",
    "category": "GHL",
    "img": "../vendor-lead-gen.png",
    "desc": "Segment branched GoHighLevel lead gen workflow for financial services. Routes each vendor type through tailored outreach across the full Florida database automatically.",
    "solution": "Built a GoHighLevel lead gen workflow that branches outreach by vendor segment across the target list. Each path delivers segment specific messaging instead of a single blanket campaign."
  },
  {
    "title": "IVR Call Routing System",
    "category": "GHL",
    "img": "../ivr-call-routing-system.png",
    "desc": "Department aware GoHighLevel IVR that greets callers with Press 1 for Sales or Press 2 for Installations and Services. Routes instantly to the right team and auto recovers missed calls.",
    "solution": "Configured a GoHighLevel IVR menu to route by intent. Sales connects to sales, installation and service to operations. Unanswered calls go to the correct voicemail and trigger a missed call sequence with SMS follow up so no inquiry is lost."
  },
  {
    "title": "Email Attachment Pipeline",
    "category": "Zapier",
    "img": "../zapier-email-attachment-pipeline.png",
    "desc": "Zapier flow that never loses a file again. Watches Gmail for attachments, filters by rules, uploads to Google Drive and pings Slack instantly.",
    "solution": "Built a Zapier automation that watches Gmail for new attachments, filters by criteria, uploads matching files to Google Drive in the right folder and sends a Slack notification so the team knows right away."
  },
  {
    "title": "Shopify Fraud & Inventory Monitor",
    "category": "Zapier",
    "img": "../zapier-shopify-fraud-inventory.png",
    "desc": "Zapier fraud and inventory guard that watches every Shopify order, checks Sheets and routes risk instantly to Slack or the sheet for next action.",
    "solution": "Built a Zapier flow triggered when Shopify flags an order as high risk. Formatter cleans the payload, a Sheets lookup finds the item record and conditional paths split dynamically. Path D sends targeted Slack reminders for immediate review, Path A updates the sheet row and applies strict filters for further processing."
  },
  {
    "title": "Daily Task Automation Workflow",
    "category": "Zapier",
    "img": "../zapier-daily-task-automation.png",
    "desc": "Zapier daily scheduler that compiles todays Asana assignments and emails the summary via Gmail. Morning plan delivers itself.",
    "solution": "Built a daily Zapier schedule that pulls the days Asana tasks and sends the assignment summary through Gmail so everyone starts aligned without manual compiling."
  },
  {
    "title": "Sales Alert Autopilot",
    "category": "Zapier",
    "img": "../zapier-sales-alert-autopilot.png",
    "desc": "Zapier alert engine that enriches every lead and routes by priority. High priority hits Sheets and Slack with an AI drafted email while low priority gets a Gmail notice.",
    "solution": "Built a Zapier flow from lead webhook through Apollo enrichment into priority Paths. High priority leads log to Sheets, ping Slack and trigger an AI drafted email. Low priority leads receive a Gmail notice so nothing is ignored but focus stays on hot prospects."
  },
  {
    "title": "Spreadsheet Event Scheduler",
    "category": "Zapier",
    "img": "../zapier-spreadsheet-event-scheduler.png",
    "desc": "Zapier scheduler that turns sheet rows into calendar events instantly. Watches Sheets, creates Google Calendar events and notifies Slack.",
    "solution": "Built a Zapier flow that watches Google Sheets for new or updated rows, creates detailed Google Calendar events and sends a Slack channel notification so the team knows right away."
  },
  {
    "title": "Asana to CRM Lead Engagement",
    "category": "Zapier",
    "img": "../assets/project-previews/zapier-asana-crm-lead-engagement.png",
    "desc": "Multi stage Zapier workflow that ties Asana, Gmail, Drive and AI together. Task status drives branch logic, folders, quotes, follow ups and closing emails without manual handoffs.",
    "solution": "Built a Zapier flow triggered on Asana task updates with multi branch routing by project status. Ready to Start creates Drive folders and Asana subtasks. No Response and Quoted send Gmail outreach and quotes, wait with timed delays, check response filters and run follow up sequences. Approved uses AI by Zapier to extract details, pull files from Drive and send confirmations. Paid and Closed use AI to generate executive summaries and send closing emails via Gmail."
  },
  {
    "title": "Client & Task Management Workflow",
    "category": "Zapier",
    "img": "../zapier-client-task-management.png",
    "desc": "Zapier onboarding flow that fires the instant a client signs up. Paths create the record, assign tasks and notify Slack so nothing is forgotten.",
    "solution": "Built a Zapier workflow with Paths that routes each new client automatically. Creates the client record, assigns the right tasks and pings the team in Slack for ownership and next steps."
  },
  {
    "title": "Lead Capture & CRM Sync",
    "category": "Make.com",
    "img": "../make-lead-capture-crm-sync.png",
    "desc": "Make.com lead routing that scores every prospect, syncs records instantly and alerts sales the moment a high value lead lands.",
    "solution": "Built a Make.com scenario that captures payloads via Webhook and standardizes variables, then routes with intelligent logic across three paths. High priority leads above 70 score log to Airtable, sync to HubSpot, notify Slack and fire Gmail outreach. Standard leads below 70 record to Airtable, update HubSpot and send standard Slack and Gmail follow ups. Invalid data flags instantly to a dedicated Slack channel for review."
  },
  {
    "title": "Social Media Update Automation",
    "category": "Make.com",
    "img": "../make-social-media-automation.png",
    "desc": "Make.com automation that turns a single sheet row into a live post and a logged result. Slack plus Facebook Page publish then writes status back automatically.",
    "solution": "Built a Make.com flow triggered by a new Google Sheets row. It creates a Slack message, publishes to Facebook Page and then writes the publish status back to the sheet so the log stays accurate without copy paste."
  },
  {
    "title": "Multi-Message Slack Router",
    "category": "Make.com",
    "img": "../make-multi-message-slack-router.png",
    "desc": "Make.com router that fans a single sheet row into sequential Slack delivery. One input automatically notifies every relevant channel in the right order.",
    "solution": "Built a Make.com flow triggered by a new Google Sheets row that feeds a Router. Each route delivers the message to a specific Slack channel in sequence so coverage is complete without manual copy paste."
  },
  {
    "title": "Automated Facebook Page Posting",
    "category": "Make.com",
    "img": "../make-facebook-page-posting.png",
    "desc": "Make.com content flow that publishes from Sheets to Facebook Page, alerts Slack and logs the result back to the row. Calendar drives itself.",
    "solution": "Built a Make.com scenario that pulls content from Google Sheets, publishes to Facebook Page, notifies Slack and then updates the sheet row with the publish result for full traceability."
  },
  {
    "title": "Xero Transaction Sync",
    "category": "Make.com",
    "img": "../make-xero-transaction-sync.png",
    "desc": "Make.com finance sync that bridges Xero, Sheets and Asana. A completed Asana task triggers export, then router and iterator sync every transaction automatically.",
    "solution": "Built a Make.com flow where a completed Asana task triggers a Xero export. A router and iterator then process each transaction and sync results to Google Sheets and back to Asana for full alignment."
  },
  {
    "title": "Gmail AI Integration",
    "category": "Make.com",
    "img": "../make-gmail-ai-integration.png",
    "desc": "Make.com inbox automation that puts AI in the loop end to end. Watches Gmail, parses with Gemini, stores to Drive, logs to Sheets and sends the reply.",
    "solution": "Built a Make.com flow that watches Gmail and runs each message through Gemini. Files land in Google Drive, structured data logs to Google Sheets and an AI drafted reply sends automatically."
  },
  {
    "title": "Facebook Messenger AI Agent",
    "category": "n8n",
    "img": "../n8n-facebook-messenger-ai-agent.png",
    "desc": "n8n AI agent inside Messenger that understands intent, answers from a Docs knowledge base and logs smart notes while remembering past context.",
    "solution": "Built an n8n flow where users chat on Messenger normally. Gemini interprets intent and generates replies, Google Docs serves as knowledge base and memory store, and the agent remembers prior conversations while updating records automatically."
  },
  {
    "title": "Automated Email Outreach",
    "category": "n8n",
    "img": "../n8n-automated-email-outreach.png",
    "desc": "n8n outreach engine that personalizes cold email at volume. Hourly Sheets pull, AI per sector, Outlook send and status logged back automatically.",
    "solution": "Built an n8n flow that pulls from Google Sheets hourly, uses AI to personalize per sector, sends via Outlook and logs sent or failed status back to the sheet for tracking."
  },
  {
    "title": "AI Agent",
    "category": "n8n",
    "img": "../n8n-ai-agent.png",
    "desc": "Reusable n8n AI brain any app can hit via webhook. Gemini reasoning plus conversation memory and HTTP tool calls for context aware responses.",
    "solution": "Built a webhook triggered n8n agent with Gemini, conversation memory and HTTP tool calls. It fetches context on demand and responds intelligently to the caller."
  },
  {
    "title": "AI Sales Agent",
    "category": "n8n",
    "img": "../n8n-ai-sales-agent.png",
    "desc": "n8n sales agent that never drops a follow up. Loads leads from Sheets and runs AI first, second and third touch sequences with memory while writing status back.",
    "solution": "Built an n8n flow that loads leads from Google Sheets and runs AI first, second and third touch email sequences with conversation memory, updating each status back to the sheet so tracking stays automatic."
  },
  {
    "title": "AI Customer Support Automation",
    "category": "n8n",
    "img": "../n8n-ai-customer-support.png",
    "desc": "n8n support flow that answers repetitive email instantly. Gmail trigger, Gemini classification and an AI agent that drafts and sends context aware replies.",
    "solution": "Built an n8n flow with Gmail trigger. Gemini classifies each email, an AI agent drafts a context aware reply, then the message auto sends and is labeled for traceability."
  },
  {
    "title": "Lead Capture to AI Qualification to GoHighLevel",
    "category": "n8n",
    "img": "../n8n-lead-capture-ai-qualification-ghl.png",
    "desc": "n8n automation that captures raw webhook leads, deduplicates GoHighLevel and routes only AI qualified prospects into the pipeline as opportunities.",
    "solution": "Built an n8n flow that ingests webhooks and standardizes contact formatting, searches GoHighLevel to check for existing contacts, runs details through an LLM Chain via OpenRouter for intent and quality scoring, then issues an HTTP request to create a fully qualified opportunity directly inside GoHighLevel."
  },
  {
    "title": "RAG Forge Knowledge Automation",
    "category": "n8n",
    "img": "../n8n-rag-forge-knowledge.png",
    "desc": "n8n retrieval workflow that keeps AI knowledge bases live. Drive changes trigger vector cleanup, embedding and Supabase sync for hallucination free answers.",
    "solution": "Built an n8n flow that monitors Google Drive in real time for creates, updates and deletes. It deletes outdated vectors in Supabase when files are revised, downloads updated files, generates fresh embeddings via OpenAI with a data loader and updates the Supabase Vector Store so retrieval stays synchronized."
  },
  {
    "title": "Cross-System Intelligence",
    "category": "n8n",
    "img": "../n8n-cross-system-intelligence.png",
    "desc": "n8n AI layer that unifies HubSpot, Sheets, Telegram and Gmail. Webhook payloads are validated, scored by OpenAI and routed across 4 paths for instant triage.",
    "solution": "Built an n8n flow that ingests live payloads via Webhook Trigger and validates data, uses OpenAI to evaluate sentiment, churn risk, deal value and context, parses decisions and routes across 4 specialized paths for High Value, Risk, Additional Info and Default, then upserts HubSpot contacts, appends full records to Google Sheets, sends targeted Telegram alerts and drafts executive summaries in Gmail."
  },
  {
    "title": "RAG Pipeline & AI Chatbot",
    "category": "n8n",
    "img": "../n8n-rag-pipeline-chatbot.png",
    "desc": "n8n RAG stack that turns every Drive upload into instant answers. Files embed via OpenAI into Pinecone and a chat agent serves sourced replies.",
    "solution": "Built an n8n flow where a Google Drive upload triggers ingestion, OpenAI generates embeddings that land in Pinecone and a chat agent answers directly from that knowledge base with sources."
  },
  {
    "title": "Lead Temperature Router",
    "category": "n8n",
    "img": "../n8n-lead-temperature-router.png",
    "desc": "n8n triage flow that scores every form submission as Cold, Warm or Hot via Switch and appends instantly to the matching Google Sheet for tailored follow up.",
    "solution": "Built an n8n flow triggered on form submission that scores intent through a Switch. Cold leads for awareness, Warm for nurturing and Hot for immediate sales action are appended to their matching Google Sheet automatically."
  },
  {
    "title": "Invoice Follow-Up System",
    "category": "n8n",
    "img": "../n8n-invoice-follow-up.png",
    "desc": "n8n finance flow that chases overdue invoices on autopilot. Daily Sheets read tiers by days overdue and escalates Gmail reminders with internal alerts.",
    "solution": "Built an n8n flow with a daily Sheets read. Invoices are tiered by days overdue, escalating Gmail reminders send automatically and internal alerts trigger at 30 plus days so nothing is missed."
  }
];
