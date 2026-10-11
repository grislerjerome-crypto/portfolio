document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const STORAGE_KEY = 'northstar-single-org-crm-v2';
  const seed = {
    contacts: [
      {id:1,name:'Olivia Bennett',email:'olivia.bennett@example.com',phone:'(512) 555-0138',company:'Bennett & Co.',status:'Customer',value:8400,last:'12 min ago',source:'Google Ads'},
      {id:2,name:'Marcus Johnson',email:'marcus.j@example.com',phone:'(737) 555-0184',company:'Lone Star Studio',status:'Lead',value:3200,last:'2 hours ago',source:'Referral'},
      {id:3,name:'Sophia Williams',email:'sophia.w@example.com',phone:'(210) 555-0149',company:'Willow Creative',status:'At Risk',value:5900,last:'Yesterday',source:'Website'},
      {id:4,name:'Ethan Parker',email:'ethan.p@example.com',phone:'(512) 555-0177',company:'Parker Works',status:'Customer',value:11200,last:'2 days ago',source:'Organic'},
      {id:5,name:'Ava Martinez',email:'ava.m@example.com',phone:'(404) 555-0114',company:'Peachtree Homes',status:'Lead',value:7600,last:'20 min ago',source:'Facebook'},
      {id:6,name:'Noah Thompson',email:'noah.t@example.com',phone:'(678) 555-0191',company:'Thompson Electric',status:'Customer',value:12800,last:'Yesterday',source:'Referral'},
      {id:7,name:'Emma Davis',email:'emma.d@example.com',phone:'(470) 555-0166',company:'Davis Property Group',status:'Customer',value:9400,last:'3 days ago',source:'Google Ads'},
      {id:8,name:'James Wilson',email:'james.w@example.com',phone:'(312) 555-0117',company:'Wilson Logistics',status:'Lead',value:15500,last:'45 min ago',source:'LinkedIn'},
      {id:9,name:'Mia Anderson',email:'mia.a@example.com',phone:'(773) 555-0188',company:'Anderson Health',status:'Customer',value:22000,last:'Yesterday',source:'Referral'},
      {id:10,name:'Lucas Moore',email:'lucas.m@example.com',phone:'(305) 555-0144',company:'Moore Hospitality',status:'At Risk',value:4800,last:'1 week ago',source:'Website'}
    ],
    deals: [
      {id:1,name:'Bennett annual plan',company:'Bennett & Co.',value:8400,stage:'Qualified'},
      {id:2,name:'Studio team rollout',company:'Lone Star Studio',value:3200,stage:'New Lead'},
      {id:3,name:'Creative group renewal',company:'Willow Creative',value:5900,stage:'Proposal'},
      {id:4,name:'Parker expansion',company:'Parker Works',value:11200,stage:'Won'},
      {id:5,name:'Multi-property service',company:'Peachtree Homes',value:7600,stage:'Qualified'},
      {id:6,name:'Electrical partner plan',company:'Thompson Electric',value:12800,stage:'Proposal'},
      {id:7,name:'Enterprise counsel',company:'Wilson Logistics',value:15500,stage:'New Lead'},
      {id:8,name:'Compliance retainer',company:'Anderson Health',value:22000,stage:'Won'},
      {id:9,name:'Hospitality wellness',company:'Moore Hospitality',value:4800,stage:'Qualified'}
    ],
    conversations: [
      {id:1,contactId:1,channel:'SMS',unread:true,time:'9:42 AM',preview:'Thursday at 2 works perfectly.',messages:[{out:true,text:'Hi Olivia, would Thursday at 2 work for your consultation?',time:'9:36 AM'},{out:false,text:'Thursday at 2 works perfectly. Thank you!',time:'9:42 AM'}]},
      {id:2,contactId:2,channel:'Email',unread:true,time:'8:15 AM',preview:'Could you send the pricing options?',messages:[{out:false,text:'Could you send the pricing options for a team of twelve?',time:'8:15 AM'}]},
      {id:3,contactId:3,channel:'Chat',unread:false,time:'Yesterday',preview:'I need help updating our billing details.',messages:[{out:false,text:'I need help updating our billing details.',time:'Yesterday'},{out:true,text:'I can help with that. I sent a secure update link.',time:'Yesterday'}]},
      {id:4,contactId:5,channel:'Email',unread:true,time:'10:20 AM',preview:'We are ready to schedule the estimate.',messages:[{out:false,text:'We are ready to schedule the estimate for next week.',time:'10:20 AM'}]},
      {id:5,contactId:8,channel:'SMS',unread:false,time:'Monday',preview:'The agreement looks good.',messages:[{out:false,text:'The agreement looks good. Our team will sign today.',time:'Monday'}]}
    ],
    workflow:{active:true,nodes:[{id:1,type:'Trigger',icon:'⚡',label:'Contact form submitted'},{id:2,type:'Email',icon:'✉',label:'Send welcome email'},{id:3,type:'Wait',icon:'◷',label:'Wait 15 minutes'},{id:4,type:'Condition',icon:'⑂',label:'Did contact reply?'},{id:5,type:'Task',icon:'✓',label:'Notify opportunity owner'}]},
    automationConnectors:[
      {id:'ghl',name:'GoHighLevel',purpose:'Create or update contacts, opportunities, and campaign actions in GoHighLevel.',connected:true},
      {id:'zapier',name:'Zapier',purpose:'Trigger a Zap to move CRM events across thousands of business apps.',connected:false},
      {id:'make',name:'Make',purpose:'Run a visual scenario for advanced routing, transformation, and enrichment.',connected:false},
      {id:'n8n',name:'n8n',purpose:'Call a self-hosted or cloud workflow for flexible technical automation.',connected:false}
    ],
    emailProviders:[
      {id:'gmail',name:'Gmail / Google Workspace',kind:'OAuth 2.0',connected:true,lastSync:'4 min ago'},
      {id:'outlook',name:'Microsoft Outlook / Microsoft 365',kind:'OAuth 2.0',connected:false,lastSync:'Never'},
      {id:'sendgrid',name:'SendGrid',kind:'API key',connected:true,lastSync:'12 min ago'},
      {id:'mailgun',name:'Mailgun',kind:'API key',connected:false,lastSync:'Never'}
    ],
    defaultEmailProvider:'gmail',
    fields:[{id:1,label:'Preferred location',key:'preferred_location',type:'Dropdown'},{id:2,label:'Service interest',key:'service_interest',type:'Multi-select'},{id:3,label:'Lifetime value tier',key:'lifetime_value_tier',type:'Dropdown'},{id:4,label:'Consent date',key:'consent_date',type:'Date'}],
    team:[{id:1,name:'Jordan Rivera',email:'jordan@northstar.demo',role:'Administrator'},{id:2,name:'Maya Chen',email:'maya@northstar.demo',role:'Sales Manager'},{id:3,name:'David Brooks',email:'david@northstar.demo',role:'Account Manager'},{id:4,name:'Elena Torres',email:'elena@northstar.demo',role:'Analyst'}],
    permissions:{contacts:true,pipelines:true,inbox:true,automations:true,settings:false,billing:false},
    integrations:[{id:'stripe',name:'Stripe',mark:'S',desc:'Sync payments, invoices, subscriptions, and customer value.',connected:true},{id:'twilio',name:'Twilio',mark:'T',desc:'Power SMS and voice conversations from the unified inbox.',connected:true},{id:'google-business',name:'Google Business',mark:'G',desc:'Connect reviews, listings, and local customer interactions.',connected:false},{id:'slack',name:'Slack',mark:'#',desc:'Route real-time workflow alerts to team channels.',connected:true},{id:'quickbooks',name:'QuickBooks',mark:'Q',desc:'Sync customer records, invoices, and revenue reporting.',connected:false}],
    audit:[
      {time:'Today, 10:42 AM',actor:'Jordan Rivera',event:'Updated role permissions',resource:'Sales Manager',ip:'172.58.42.18',type:'Security'},
      {time:'Today, 9:42 AM',actor:'System Worker',event:'Completed 12 automation runs',resource:'Lead response accelerator',ip:'Internal',type:'Automation'},
      {time:'Today, 9:18 AM',actor:'Maya Chen',event:'Exported contact segment',resource:'Customer records',ip:'98.217.31.44',type:'Data'},
      {time:'Yesterday, 2:31 PM',actor:'David Brooks',event:'Moved opportunity to Won',resource:'Thompson Electric',ip:'73.162.11.90',type:'Data'},
      {time:'Oct 8, 11:20 AM',actor:'System Worker',event:'Refreshed OAuth credentials',resource:'Gmail adapter',ip:'Internal',type:'Security'}
    ],
    activities:[
      {icon:'↗',text:'Maya moved “Bennett annual plan” to Qualified',time:'12 minutes ago'},
      {icon:'✉',text:'New SMS reply from Olivia Bennett',time:'18 minutes ago'},
      {icon:'◇',text:'Lead response accelerator completed 12 runs',time:'34 minutes ago'},
      {icon:'$',text:'Stripe recorded a $2,400 payment',time:'1 hour ago'}
    ]
  };

  const clone = value => JSON.parse(JSON.stringify(value));
  let state;
  try { state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || clone(seed); } catch (e) { state = clone(seed); }
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const money = n => new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
  const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  const escapeHTML = v => String(v).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  const initials = name => name.split(' ').map(p => p[0]).slice(0,2).join('').toUpperCase();
  const providerById = id => state.emailProviders.find(p => p.id === id);

  const brandImage = (file, name) => `<img src="assets/${file}" alt="${name} logo" loading="lazy">`;
  const connectorLogos = {
    ghl: brandImage('highlevel.png', 'HighLevel'),
    zapier: brandImage('zapier.svg', 'Zapier'),
    make: brandImage('make.svg', 'Make'),
    n8n: brandImage('n8n.svg', 'n8n')
  };
  const emailLogos = {
    gmail: brandImage('gmail.svg', 'Gmail'),
    outlook: brandImage('outlook.svg', 'Microsoft Outlook'),
    sendgrid: brandImage('sendgrid.svg', 'Twilio SendGrid'),
    mailgun: brandImage('mailgun.svg', 'Mailgun')
  };

  function toast(title, detail='Changes saved to this browser') {
    const el=document.createElement('div'); el.className='toast'; el.innerHTML=`<strong>${escapeHTML(title)}</strong><span>${escapeHTML(detail)}</span>`;
    const stack=$('#toasts'); while(stack.children.length>=3) stack.firstElementChild.remove();
    stack.append(el); setTimeout(()=>el.remove(),3200);
  }
  function addAudit(event, resource, type='Data') { state.audit.unshift({time:'Just now',actor:'Jordan Rivera',event,resource,ip:'172.58.42.18',type}); }
  function navigate(view) {
    const target=$(`#view-${view}`); if(!target) return;
    $$('.view').forEach(v=>v.classList.remove('active')); target.classList.add('active');
    $$('.nav-item').forEach(n=>n.classList.toggle('active',n.dataset.view===view));
    const label=$(`.nav-item[data-view="${view}"]`)?.textContent.replace(/\d+/g,'').trim() || 'Executive Dashboard';
    $('#pageCrumb').textContent=label; location.hash=view; $('#sidebar').classList.remove('open'); window.scrollTo(0,0);
    const renderers={overview:renderOverview,contacts:renderContacts,pipelines:renderPipeline,inbox:renderInbox,automations:()=>{renderAutomationConnectors();renderWorkflow();},email:renderEmailProviders,fields:renderFields,team:renderTeam,audit:renderAudit,integrations:renderIntegrations};
    renderers[view]?.();
  }

  function renderShell() {
    $('#contactNavCount').textContent=state.contacts.length;
    $('#inboxBadge').textContent=state.conversations.filter(c=>c.unread).length || '';
  }
  function renderOverview() {
    const deals=state.deals, won=deals.filter(d=>d.stage==='Won').reduce((s,d)=>s+d.value,0), pipeline=deals.filter(d=>d.stage!=='Won').reduce((s,d)=>s+d.value,0);
    $('#healthScore').textContent='94%';
    $('#metricGrid').innerHTML=[['Forecast revenue',money(won+pipeline),'↑ 8.4% vs last month','◈'],['Open pipeline',money(pipeline),'↑ '+deals.filter(d=>d.stage!=='Won').length+' opportunities','⌁'],['Contacts',state.contacts.length.toLocaleString(),'Unified organization record','♙'],['Revenue won',money(won),'Updated from deals','↗']].map(x=>`<article class="metric"><span>${x[0]}</span><strong>${x[1]}</strong><small>${x[2]}</small><i>${x[3]}</i></article>`).join('');
    $('#pulseChart').innerHTML=[28,38,33,52,46,63,58,72,68,85,76,94,88,100].map(h=>`<i style="height:${h}%"></i>`).join('');
    $('#revenueChart').innerHTML=['May','Jun','Jul','Aug','Sep','Oct'].map((m,i)=>`<div class="chart-month"><i style="height:${38+i*8}%"></i><i style="height:${27+i*10}%"></i><span>${m}</span></div>`).join('');
    const connectedEmails=state.emailProviders.filter(p=>p.connected).length, connectedAutomations=state.automationConnectors.filter(p=>p.connected).length;
    $('#accountHealth').innerHTML=[['Pipeline coverage',92,'Revenue operations'],['Email readiness',connectedEmails*25,'Provider adapters'],['Automation reach',Math.max(25,connectedAutomations*25),'Connected tools']].map(x=>`<div class="health-row"><div><strong>${x[0]}</strong><small>${x[2]}</small></div><b>${x[1]}%</b><div class="health-bar"><i style="width:${x[1]}%"></i></div></div>`).join('');
    $('#activityList').innerHTML=state.activities.slice(0,5).map(a=>`<div class="activity-item"><span class="activity-icon">${a.icon}</span><div><p>${escapeHTML(a.text)}</p><small>${a.time}</small></div></div>`).join('');
    $('#channelMix').innerHTML=[['Email',48,'var(--cyan)'],['SMS',34,'var(--accent)'],['Web chat',18,'var(--violet)']].map(x=>`<div class="mix-row"><div><span>${x[0]}</span><b>${x[1]}%</b></div><span><i style="width:${x[1]}%;background:${x[2]}"></i></span></div>`).join('');
  }
  function renderContacts() {
    const q=$('#contactSearch').value.trim().toLowerCase(), f=$('#contactFilter').value;
    const list=state.contacts.filter(c=>(f==='all'||c.status===f)&&(!q||[c.name,c.email,c.company].some(v=>v.toLowerCase().includes(q))));
    $('#contactSubtitle').textContent=`${state.contacts.length} organization-wide customer records`;
    $('#contactRows').innerHTML=list.map(c=>`<tr class="clickable" data-contact="${c.id}"><td><strong>${escapeHTML(c.name)}</strong><small>${escapeHTML(c.email)}</small></td><td>${escapeHTML(c.company)}</td><td><span class="tag ${c.status.replace(' ','-')}">${c.status}</span></td><td>${money(c.value)}</td><td>${c.last}</td><td><button class="row-action" data-contact="${c.id}" aria-label="Open ${escapeHTML(c.name)}">→</button></td></tr>`).join('');
    $('#contactEmpty').style.display=list.length?'none':'block';
  }
  function renderPipeline() {
    const stages=['New Lead','Qualified','Proposal','Won'], list=state.deals, total=list.reduce((s,d)=>s+d.value,0), won=list.filter(d=>d.stage==='Won').reduce((s,d)=>s+d.value,0);
    $('#pipelineStats').innerHTML=[['Open value',money(total-won)],['Won revenue',money(won)],['Opportunities',list.length],['Win rate',list.length?Math.round(list.filter(d=>d.stage==='Won').length/list.length*100)+'%':'0%']].map(x=>`<div class="summary-card"><span>${x[0]}</span><strong>${x[1]}</strong></div>`).join('');
    $('#kanban').innerHTML=stages.map(stage=>{const cards=list.filter(d=>d.stage===stage),sum=cards.reduce((s,d)=>s+d.value,0);return `<section class="kanban-col" data-stage="${stage}"><div class="kanban-head"><strong>${stage} · ${cards.length}</strong><span>${money(sum)}</span></div>${cards.map(d=>`<article class="deal-card" draggable="true" data-deal="${d.id}"><h3>${escapeHTML(d.name)}</h3><p>${escapeHTML(d.company)}</p><div><b>${money(d.value)}</b><select data-move-deal="${d.id}" aria-label="Move ${escapeHTML(d.name)}">${stages.map(s=>`<option ${s===stage?'selected':''}>${s}</option>`).join('')}</select></div></article>`).join('')}</section>`}).join('');
    bindDragDrop();
  }
  function bindDragDrop() {
    $$('.deal-card').forEach(card=>{card.addEventListener('dragstart',()=>card.classList.add('dragging'));card.addEventListener('dragend',()=>card.classList.remove('dragging'))});
    $$('.kanban-col').forEach(col=>{col.addEventListener('dragover',e=>e.preventDefault());col.addEventListener('drop',()=>{const card=$('.deal-card.dragging');if(card) moveDeal(Number(card.dataset.deal),col.dataset.stage)})});
  }
  function moveDeal(id, stage) { const d=state.deals.find(x=>x.id===id); if(!d||d.stage===stage)return; d.stage=stage; addAudit('Moved opportunity',d.name,'Data'); save(); renderPipeline(); renderOverview(); toast('Opportunity moved',`${d.name} is now in ${stage}`); }

  let inboxChannel='All', selectedThread=null;
  function renderInbox() {
    const threads=state.conversations.filter(c=>inboxChannel==='All'||c.channel===inboxChannel);
    $('#threadList').innerHTML=threads.length?threads.map(c=>{const p=state.contacts.find(x=>x.id===c.contactId);return `<button class="thread-item ${selectedThread===c.id?'active':''}" data-thread="${c.id}"><div class="thread-top"><strong>${escapeHTML(p?.name||'Unknown')}</strong><time>${c.time}</time></div><p>${escapeHTML(c.preview)}</p><div class="thread-meta"><span>${c.channel}</span><span>${c.unread?'● New':'Read'}</span></div></button>`}).join(''):'<div class="conversation-empty">No conversations in this channel.</div>';
    $$('#channelTabs button').forEach(b=>b.classList.toggle('active',b.dataset.channel===inboxChannel));
    if(selectedThread && !threads.some(t=>t.id===selectedThread)) selectedThread=null;
    const convo=state.conversations.find(c=>c.id===selectedThread);
    if(!convo){$('#conversationPanel').innerHTML='<div class="conversation-empty">Select a conversation to view the thread.</div>';$('#contactContext').innerHTML='<span>Select a customer to view contact context.</span>';return}
    const p=state.contacts.find(x=>x.id===convo.contactId); convo.unread=false; save(); renderShell();
    const provider=providerById(state.defaultEmailProvider);
    $('#conversationPanel').innerHTML=`<div class="conversation-head"><div><h2>${escapeHTML(p.name)}</h2><span>${convo.channel} · ${escapeHTML(p.email)}</span></div><span class="status">Open</span></div><div class="messages">${convo.messages.map(m=>`<div class="message ${m.out?'out':''}">${escapeHTML(m.text)}<time>${m.time}${m.provider?' · '+escapeHTML(m.provider):''}</time></div>`).join('')}</div><form class="composer" id="messageForm"><textarea id="messageInput" rows="2" required placeholder="Write a ${convo.channel.toLowerCase()} reply..."></textarea><button class="btn primary" type="submit">Send</button>${convo.channel==='Email'?`<small class="composer-provider">Sending with ${escapeHTML(provider?.name||'no provider selected')}</small>`:''}</form>`;
    $('#contactContext').innerHTML=`<div class="member-avatar">${initials(p.name)}</div><h3>${escapeHTML(p.name)}</h3><span>${escapeHTML(p.company)}</span><div class="context-stat"><span>Email</span><strong>${escapeHTML(p.email)}</strong></div><div class="context-stat"><span>Phone</span><strong>${escapeHTML(p.phone)}</strong></div><div class="context-stat"><span>Customer value</span><strong>${money(p.value)}</strong></div><button class="btn ghost" data-contact="${p.id}">Open full record</button>`;
    $('#messageForm').addEventListener('submit',sendMessage);
  }
  function sendMessage(e){
    e.preventDefault(); const input=$('#messageInput'), text=input.value.trim(); if(!text)return; const c=state.conversations.find(x=>x.id===selectedThread);
    let providerName='';
    if(c.channel==='Email') { const provider=providerById(state.defaultEmailProvider); if(!provider?.connected){toast('Email provider unavailable','Connect the default provider before sending');return} providerName=provider.name; }
    c.messages.push({out:true,text,time:'Just now',provider:providerName}); c.preview=text; c.time='Now'; addAudit(`Sent ${c.channel} message`,providerName?`${state.contacts.find(x=>x.id===c.contactId).name} via ${providerName}`:state.contacts.find(x=>x.id===c.contactId).name,'Data'); save(); renderInbox(); toast('Message sent',providerName?`Demo sent through ${providerName}`:`Delivered through ${c.channel}`);
  }

  function renderAutomationConnectors(){
    $('#automationConnectorGrid').innerHTML=state.automationConnectors.map(c=>`<article class="connector-card" data-connector="${c.id}"><div class="connector-head"><span class="connector-logo">${connectorLogos[c.id]}</span><div><h3>${c.name}</h3><span class="connection-state ${c.connected?'on':''}">${c.connected?'Connected':'Not connected'}</span></div></div><p>${c.purpose}</p><div class="connector-actions"><button class="btn ghost small" data-toggle-connector="${c.id}">${c.connected?'Disconnect':'Connect demo'}</button><button class="btn primary small" data-use-connector="${c.id}" ${c.connected?'':'disabled'}>Use in workflow</button></div></article>`).join('');
  }
  function addWorkflowNode(type, icon, label, connector=''){state.workflow.nodes.push({id:Date.now(),type,icon,label,connector});addAudit('Added workflow node',type,'Automation');save();renderWorkflow();toast('Workflow step added',label)}
  function renderWorkflow() {
    const w=state.workflow; $('#workflowStatusText').textContent=(w.active?'Active':'Paused')+' · Last run 8 minutes ago'; $('#toggleWorkflow').textContent=w.active?'Pause workflow':'Activate workflow'; $('#nodeCount').textContent=w.nodes.length;
    $('#workflowCanvas').innerHTML=w.nodes.map((n,i)=>`${i?'<div class="connector"></div>':''}<article class="flow-node" data-node="${n.id}"><i class="flow-icon">${connectorLogos[n.connector]||n.icon}</i><div><strong>${escapeHTML(n.type)}</strong><small>${escapeHTML(n.label)}</small></div>${i?`<button data-remove-node="${n.id}" aria-label="Remove ${escapeHTML(n.type)}">×</button>`:''}</article>`).join('');
  }
  async function simulateWorkflow(){
    if(!state.workflow.active){toast('Workflow is paused','Activate it before running a simulation');return} const nodes=$$('.flow-node'),log=$('#runLog'); $('#runIndicator').textContent='RUNNING';
    for(let i=0;i<nodes.length;i++){nodes[i].classList.add('running');log.innerHTML+=`<p><time>${new Date().toLocaleTimeString('en-US',{hour12:false})}</time> ${escapeHTML(state.workflow.nodes[i].type)} completed</p>`;await new Promise(r=>setTimeout(r,220));nodes[i].classList.remove('running')}
    $('#runIndicator').textContent='COMPLETE';addAudit('Ran workflow simulation','Lead response accelerator','Automation');save();toast('Simulation complete',`${nodes.length} nodes executed successfully`);
  }

  function renderEmailProviders(){
    $('#emailProviderGrid').innerHTML=state.emailProviders.map(p=>`<article class="email-provider-card"><div class="provider-main"><span class="provider-logo">${emailLogos[p.id]}</span><div><h2>${p.name}</h2><span>${p.kind} · ${p.connected?'Connected':'Available'}</span></div></div><p>${p.id==='gmail'||p.id==='outlook'?'Two-way mailbox sync, threading, and delegated sending.':'Transactional delivery, templates, and delivery event webhooks.'}</p><div class="provider-meta"><span class="connection-state ${p.connected?'on':''}">${p.connected?'● Connected':'○ Not connected'}</span><small>Last sync: ${p.lastSync}</small></div><button class="btn ${p.connected?'ghost':'primary'}" data-toggle-email="${p.id}">${p.connected?'Disconnect':'Connect demo'}</button></article>`).join('');
    const connected=state.emailProviders.filter(p=>p.connected);
    $('#defaultEmailProvider').innerHTML=connected.length?connected.map(p=>`<option value="${p.id}" ${p.id===state.defaultEmailProvider?'selected':''}>${p.name}</option>`).join(''):'<option value="">Connect a provider first</option>';
    $('#saveDefaultProvider').disabled=!connected.length;
  }
  async function simulateEmailSync(){
    const connected=state.emailProviders.filter(p=>p.connected); if(!connected.length){toast('No email connection','Connect a provider before syncing');return}
    const button=$('#syncEmailBtn'),status=$('#syncStatus'); button.disabled=true; status.textContent='Syncing mailbox and delivery events...';
    await new Promise(r=>setTimeout(r,700)); connected.forEach(p=>p.lastSync='Just now'); addAudit('Completed email sync',connected.map(p=>p.name).join(', '),'Integration');save();renderEmailProviders();button.disabled=false;status.textContent=`Synced ${connected.length} provider${connected.length===1?'':'s'} just now`;toast('Email sync complete',`${connected.length} provider adapters updated`);
  }

  function renderFields(){ $('#fieldCount').textContent=state.fields.length+' fields';$('#fieldList').innerHTML=state.fields.map(f=>`<div class="field-item"><span class="field-type">${f.type}</span><div><strong>${escapeHTML(f.label)}</strong><small>${escapeHTML(f.key)}</small></div><button data-delete-field="${f.id}" aria-label="Delete ${escapeHTML(f.label)}">×</button></div>`).join('');$('#schemaPreview').textContent=JSON.stringify(Object.fromEntries(state.fields.map(f=>[f.key,`<${f.type.toLowerCase()}>`])),null,2)}
  function renderTeam(){
    $('#memberCount').textContent=state.team.length+' members'; $('#teamList').innerHTML=state.team.map(m=>`<div class="team-member"><span class="member-avatar">${initials(m.name)}</span><div><strong>${escapeHTML(m.name)}</strong><small>${escapeHTML(m.email)}</small></div><select data-member-role="${m.id}" aria-label="Role for ${escapeHTML(m.name)}">${['Administrator','Sales Manager','Account Manager','Analyst'].map(r=>`<option ${r===m.role?'selected':''}>${r}</option>`).join('')}</select></div>`).join('');
    const labels={contacts:['Manage contacts','Create, update, import, and export records'],pipelines:['Manage pipelines','Create and move revenue opportunities'],inbox:['Use unified inbox','Read and send customer messages'],automations:['Manage automations','Build, activate, and simulate workflows'],settings:['Change workspace settings','Edit adapters, branding, and custom fields'],billing:['Manage billing','View invoices and subscriptions']};
    $('#permissionList').innerHTML=Object.entries(labels).map(([key,v])=>`<div class="permission-item"><div><strong>${v[0]}</strong><small>${v[1]}</small></div><label class="switch"><input type="checkbox" data-permission="${key}" ${state.permissions[key]?'checked':''}><span></span></label></div>`).join('');
  }
  function renderAudit(){const q=$('#auditSearch').value.trim().toLowerCase(),f=$('#auditFilter').value;const list=state.audit.filter(a=>(f==='all'||a.type===f)&&(!q||(a.actor+' '+a.event+' '+a.resource).toLowerCase().includes(q)));$('#auditRows').innerHTML=list.map(a=>`<tr><td>${a.time}</td><td><strong>${escapeHTML(a.actor)}</strong></td><td>${escapeHTML(a.event)}</td><td>${escapeHTML(a.resource)}</td><td>${a.ip}</td><td><span class="tag">${a.type}</span></td></tr>`).join('')}
  function renderIntegrations(){
    const specialized=[...state.emailProviders.map(p=>({id:`email:${p.id}`,name:p.name,logo:emailLogos[p.id],desc:'Email adapter managed in Email Connections.',connected:p.connected})),...state.automationConnectors.map(p=>({id:`auto:${p.id}`,name:p.name,logo:connectorLogos[p.id],desc:p.purpose,connected:p.connected}))];
    $('#integrationGrid').innerHTML=[...state.integrations,...specialized].map(i=>`<article class="integration-card"><div class="integration-top"><span class="integration-logo">${i.logo||i.mark}</span><div><h2>${i.name}</h2><small>${i.connected?'Connected and ready':'Available to connect'}</small></div></div><p>${i.desc}</p><div class="integration-foot"><span>${i.id.includes(':')?'Managed in dedicated workspace':i.connected?'Last sync 4 min ago':'Secure API connection'}</span>${i.id.includes(':')?`<button class="text-btn" data-go="${i.id.startsWith('email:')?'email':'automations'}">Manage →</button>`:`<label class="switch"><input type="checkbox" data-integration="${i.id}" ${i.connected?'checked':''}><span></span></label>`}</div></article>`).join('');
  }

  function openContact(id){const c=state.contacts.find(x=>x.id===id);if(!c)return;$('#drawerContent').innerHTML=`<div class="drawer-content"><div class="drawer-profile"><span class="member-avatar">${initials(c.name)}</span><div><h2>${escapeHTML(c.name)}</h2><p>${escapeHTML(c.company)} · ${escapeHTML(c.email)}</p></div></div><div class="drawer-stats"><div><span>Status</span><strong>${c.status}</strong></div><div><span>Value</span><strong>${money(c.value)}</strong></div><div><span>Source</span><strong>${c.source}</strong></div></div><span class="panel-kicker">RELATIONSHIP TIMELINE</span><div class="timeline"><div class="timeline-item"><strong>Record viewed by Jordan</strong><p>Customer profile opened in Contact 360.</p><time>Just now</time></div><div class="timeline-item"><strong>Follow-up message delivered</strong><p>Campaign message sent successfully.</p><time>2 days ago</time></div><div class="timeline-item"><strong>Opportunity created</strong><p>${escapeHTML(c.company)} added to the sales pipeline.</p><time>1 week ago</time></div><div class="timeline-item"><strong>Contact captured</strong><p>Source: ${escapeHTML(c.source)}</p><time>2 weeks ago</time></div></div></div>`;$('#contactDrawer').classList.add('open');$('#contactDrawer').setAttribute('aria-hidden','false')}

  const modal={mode:null};
  function openModal(mode){modal.mode=mode;const configs={
    contact:{k:'CREATE RECORD',title:'Add a new contact',submit:'Create contact',fields:[['name','Full name','text','e.g. Emily Carter'],['email','Email address','email','emily@example.com'],['company','Company','text','Company name'],['phone','Phone','tel','(512) 555-0100'],['status','Status','select',['Lead','Customer','At Risk']],['value','Customer value','number','5000']]},
    deal:{k:'NEW OPPORTUNITY',title:'Add an opportunity',submit:'Create opportunity',fields:[['name','Opportunity name','text','Annual service plan'],['company','Company','text','Company name'],['value','Value','number','7500'],['stage','Stage','select',['New Lead','Qualified','Proposal','Won']]]},
    field:{k:'EXTEND SCHEMA',title:'Create custom field',submit:'Create field',fields:[['label','Field label','text','Customer segment'],['type','Field type','select',['Text','Number','Date','Dropdown','Multi-select','Checkbox']]]},
    invite:{k:'TEAM ACCESS',title:'Invite teammate',submit:'Send invitation',fields:[['name','Full name','text','Emily Carter'],['email','Work email','email','emily@northstar.demo'],['role','Role','select',['Sales Manager','Account Manager','Analyst']]]},
    compose:{k:'DEMO EMAIL',title:'Compose an email',submit:'Send demo email',fields:[['contact','Recipient','select',state.contacts.map(c=>`${c.name} | ${c.email}`)],['subject','Subject','text','Your Northstar update'],['message','Message','textarea','Write your email message']]}
  };const c=configs[mode];$('#modalKicker').textContent=c.k;$('#modalTitle').textContent=c.title;$('#modalSubmit').textContent=c.submit;$('#modalFields').innerHTML=`<div class="form-grid">${c.fields.map(f=>`<div class="form-group ${f[0]==='message'?'full':''}"><label for="m-${f[0]}">${f[1]}</label>${f[2]==='select'?`<select id="m-${f[0]}" name="${f[0]}" required>${f[3].map(o=>`<option>${escapeHTML(o)}</option>`).join('')}</select>`:f[2]==='textarea'?`<textarea id="m-${f[0]}" name="${f[0]}" rows="5" placeholder="${f[3]}" required></textarea>`:`<input id="m-${f[0]}" name="${f[0]}" type="${f[2]}" placeholder="${f[3]}" required>`}</div>`).join('')}</div>`;$('#modalBackdrop').classList.add('open');$('#modalBackdrop').setAttribute('aria-hidden','false');setTimeout(()=>$('#modalFields input, #modalFields select, #modalFields textarea')?.focus(),30)}
  function closeModal(){ $('#modalBackdrop').classList.remove('open');$('#modalBackdrop').setAttribute('aria-hidden','true');$('#modalForm').reset() }
  function submitModal(e){
    e.preventDefault();const d=Object.fromEntries(new FormData(e.target));
    if(modal.mode==='contact'){state.contacts.push({id:Date.now(),name:d.name,email:d.email,phone:d.phone,company:d.company,status:d.status,value:Number(d.value),last:'Just now',source:'Manual'});addAudit('Created contact',d.name,'Data');renderContacts();renderShell();toast('Contact created',`${d.name} added to the organization`)}
    else if(modal.mode==='deal'){state.deals.push({id:Date.now(),name:d.name,company:d.company,value:Number(d.value),stage:d.stage});addAudit('Created opportunity',d.name,'Data');renderPipeline();toast('Opportunity created',`${money(Number(d.value))} added to ${d.stage}`)}
    else if(modal.mode==='field'){const key=d.label.toLowerCase().trim().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');state.fields.push({id:Date.now(),label:d.label,key,type:d.type});addAudit('Created custom field',d.label,'Data');renderFields();toast('Custom field created',key)}
    else if(modal.mode==='invite'){state.team.push({id:Date.now(),name:d.name,email:d.email,role:d.role});addAudit('Invited teammate',d.email,'Security');renderTeam();toast('Invitation sent',d.email)}
    else if(modal.mode==='compose'){
      const provider=providerById(state.defaultEmailProvider); if(!provider?.connected){toast('Email provider unavailable','Connect and select a default provider first');closeModal();return}
      const email=d.contact.split(' | ').pop(), contact=state.contacts.find(c=>c.email===email); let convo=state.conversations.find(c=>c.contactId===contact.id&&c.channel==='Email');
      if(!convo){convo={id:Date.now(),contactId:contact.id,channel:'Email',unread:false,time:'Now',preview:d.message,messages:[]};state.conversations.unshift(convo)}
      convo.messages.push({out:true,text:`${d.subject}\n\n${d.message}`,time:'Just now',provider:provider.name});convo.preview=d.subject;convo.time='Now';selectedThread=convo.id;inboxChannel='Email';addAudit('Sent demo email',`${contact.name} via ${provider.name}`,'Integration');state.activities.unshift({icon:'✉',text:`Demo email sent to ${contact.name} through ${provider.name}`,time:'Just now'});toast('Demo email sent',`${contact.email} via ${provider.name}`);renderShell();renderInbox();
    }
    save();renderOverview();closeModal();
  }

  function csvDownload(name, rows){const csv=rows.map(r=>r.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\n'),blob=new Blob([csv],{type:'text/csv'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('CSV export ready',`${rows.length-1} records downloaded`)}

  document.addEventListener('click',e=>{
    const nav=e.target.closest('[data-view]');if(nav){e.preventDefault();navigate(nav.dataset.view);return}
    const go=e.target.closest('[data-go]');if(go){navigate(go.dataset.go);return}
    const contact=e.target.closest('[data-contact]');if(contact){openContact(Number(contact.dataset.contact));return}
    const remove=e.target.closest('[data-remove-node]');if(remove){state.workflow.nodes=state.workflow.nodes.filter(n=>n.id!==Number(remove.dataset.removeNode));addAudit('Removed workflow node','Lead response accelerator','Automation');save();renderWorkflow();toast('Workflow step removed');return}
    const add=e.target.closest('[data-add-node]');if(add){addWorkflowNode(add.dataset.addNode,add.dataset.icon,{Email:'Send follow-up email',Wait:'Wait 1 business day',Condition:'Check engagement score',SMS:'Send reminder SMS',Task:'Create owner task'}[add.dataset.addNode]);return}
    const del=e.target.closest('[data-delete-field]');if(del){const f=state.fields.find(x=>x.id===Number(del.dataset.deleteField));state.fields=state.fields.filter(x=>x.id!==f.id);addAudit('Deleted custom field',f.label,'Data');save();renderFields();toast('Custom field removed',f.label);return}
    const toggleConnector=e.target.closest('[data-toggle-connector]');if(toggleConnector){const c=state.automationConnectors.find(x=>x.id===toggleConnector.dataset.toggleConnector);c.connected=!c.connected;addAudit(c.connected?'Connected automation provider':'Disconnected automation provider',c.name,'Integration');save();renderAutomationConnectors();renderIntegrations();toast(c.connected?'Connector ready':'Connector disconnected',`${c.name} demo state updated`);return}
    const useConnector=e.target.closest('[data-use-connector]');if(useConnector){const c=state.automationConnectors.find(x=>x.id===useConnector.dataset.useConnector);if(c?.connected)addWorkflowNode(c.name,'',`Run ${c.name} action`,c.id);return}
    const toggleEmail=e.target.closest('[data-toggle-email]');if(toggleEmail){const p=providerById(toggleEmail.dataset.toggleEmail);p.connected=!p.connected;p.lastSync=p.connected?'Ready for first sync':'Never';if(!p.connected&&state.defaultEmailProvider===p.id)state.defaultEmailProvider=state.emailProviders.find(x=>x.connected)?.id||'';addAudit(p.connected?'Connected email provider':'Disconnected email provider',p.name,'Integration');save();renderEmailProviders();renderIntegrations();toast(p.connected?'Email connection ready':'Email connection removed',`${p.name} demo state updated`);return}
  });
  document.addEventListener('change',e=>{
    if(e.target.matches('[data-move-deal]'))moveDeal(Number(e.target.dataset.moveDeal),e.target.value);
    if(e.target.matches('[data-member-role]')){const m=state.team.find(x=>x.id===Number(e.target.dataset.memberRole));m.role=e.target.value;addAudit('Changed team role',m.name,'Security');save();toast('Team role updated',`${m.name} is now ${m.role}`)}
    if(e.target.matches('[data-integration]')){const i=state.integrations.find(x=>x.id===e.target.dataset.integration);i.connected=e.target.checked;addAudit(i.connected?'Connected integration':'Disconnected integration',i.name,'Integration');save();renderIntegrations();toast(i.connected?'Integration connected':'Integration disconnected',i.name)}
  });

  $('#mobileMenu').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));
  $('#notifyBtn').addEventListener('click',()=>{$('#notifyPopover').classList.toggle('open');$('#profilePopover').classList.remove('open')});
  $('#profileBtn').addEventListener('click',()=>{$('#profilePopover').classList.toggle('open');$('#notifyPopover').classList.remove('open')});
  $('#profileClose').addEventListener('click',()=>$('#profilePopover').classList.remove('open'));
  $('#newContactBtn').addEventListener('click',()=>openModal('contact'));$('#newDealBtn').addEventListener('click',()=>openModal('deal'));$('#newFieldBtn').addEventListener('click',()=>openModal('field'));$('#inviteBtn').addEventListener('click',()=>openModal('invite'));$('#composeEmailBtn').addEventListener('click',()=>openModal('compose'));
  $('#modalClose').addEventListener('click',closeModal);$('#modalCancel').addEventListener('click',closeModal);$('#modalBackdrop').addEventListener('click',e=>{if(e.target===e.currentTarget)closeModal()});$('#modalForm').addEventListener('submit',submitModal);
  $('#drawerClose').addEventListener('click',()=>{$('#contactDrawer').classList.remove('open');$('#contactDrawer').setAttribute('aria-hidden','true')});
  $('#contactSearch').addEventListener('input',renderContacts);$('#contactFilter').addEventListener('change',renderContacts);$('#auditSearch').addEventListener('input',renderAudit);$('#auditFilter').addEventListener('change',renderAudit);
  $('#exportContacts').addEventListener('click',()=>csvDownload('northstar-contacts.csv',[['Name','Email','Phone','Company','Status','Value'],...state.contacts.map(c=>[c.name,c.email,c.phone,c.company,c.status,c.value])]));
  $('#exportAudit').addEventListener('click',()=>csvDownload('northstar-audit-log.csv',[['Timestamp','Actor','Event','Resource','IP','Type'],...state.audit.map(a=>[a.time,a.actor,a.event,a.resource,a.ip,a.type])]));
  $('#toggleWorkflow').addEventListener('click',()=>{state.workflow.active=!state.workflow.active;addAudit(state.workflow.active?'Activated workflow':'Paused workflow','Lead response accelerator','Automation');save();renderWorkflow();toast(state.workflow.active?'Workflow activated':'Workflow paused')});
  $('#runWorkflow').addEventListener('click',simulateWorkflow);
  $('#saveRole').addEventListener('click',()=>{$$('[data-permission]').forEach(x=>state.permissions[x.dataset.permission]=x.checked);addAudit('Updated role permissions','Sales Manager','Security');save();toast('Role permissions saved','Sales Manager policy updated')});
  $('#channelTabs').addEventListener('click',e=>{const b=e.target.closest('[data-channel]');if(b){inboxChannel=b.dataset.channel;selectedThread=null;renderInbox()}});
  $('#threadList').addEventListener('click',e=>{const b=e.target.closest('[data-thread]');if(b){selectedThread=Number(b.dataset.thread);renderInbox()}});
  $('#globalSearch').addEventListener('input',e=>{if(e.target.value.trim()){navigate('contacts');$('#contactSearch').value=e.target.value;renderContacts()}});
  $('#chartRange').addEventListener('change',()=>toast('Analytics range updated',$('#chartRange').value));
  $('#saveDefaultProvider').addEventListener('click',()=>{const id=$('#defaultEmailProvider').value;if(!id)return;state.defaultEmailProvider=id;addAudit('Changed default sending provider',providerById(id).name,'Integration');save();renderEmailProviders();toast('Default provider saved',providerById(id).name)});
  $('#syncEmailBtn').addEventListener('click',simulateEmailSync);
  $$('[data-action="reset-demo"]').forEach(b=>b.addEventListener('click',()=>{if(confirm('Reset all demo records and settings?')){state=clone(seed);save();selectedThread=null;renderAll();navigate('overview');toast('Demo data reset','The original organization dataset is restored')}}));
  document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('#globalSearch').focus()}if(e.key==='Escape'){closeModal();$('#contactDrawer').classList.remove('open');$('#notifyPopover').classList.remove('open');$('#profilePopover').classList.remove('open')}});

  function renderAll(){renderShell();renderOverview();renderContacts();renderPipeline();renderInbox();renderAutomationConnectors();renderWorkflow();renderEmailProviders();renderFields();renderTeam();renderAudit();renderIntegrations()}
  renderAll();
  const start=location.hash.slice(1);navigate($(`#view-${start}`)?start:'overview');
});
