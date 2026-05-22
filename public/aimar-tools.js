const modules = {
  founder: {
    title: 'Founder OS',
    summary: 'Personal command surface for priorities, context, tasks, and review loops.',
    tools: ['Priority Router', 'Daily Brief', 'Decision Ledger', 'Context Inbox'],
    workflow: ['Capture open loops', 'Rank by leverage and deadline', 'Surface next action', 'Review outcome and update memory']
  },
  workflow: {
    title: 'Workflow Engine',
    summary: 'Maps recurring processes into human, assistive, and automated execution paths.',
    tools: ['Process Mapper', 'Trigger Builder', 'Role Splitter', 'Approval Gate'],
    workflow: ['Define process boundary', 'Split steps by human / assist / auto', 'Add approval controls', 'Create repeatable operating card']
  },
  security: {
    title: 'Security / OPSEC',
    summary: 'Governance-first controls for access, logs, redaction, and blast-radius management.',
    tools: ['Redaction Filter', 'Risk Matrix', 'Access Review', 'Audit Trail'],
    workflow: ['Identify sensitive inputs', 'Default to read-only', 'Require approval before write-back', 'Log every action']
  },
  research: {
    title: 'Research Vault',
    summary: 'Turns notes, sources, and signals into durable reusable intelligence.',
    tools: ['Source Canon', 'Signal Triage', 'Brief Generator', 'Memory Map'],
    workflow: ['Collect source', 'Extract claims and patterns', 'Link to existing canon', 'Publish share-safe brief']
  },
  client: {
    title: 'Client Ops',
    summary: 'Public-safe operating layer for intake, delivery, reporting, and proof.',
    tools: ['Intake Console', 'Scope Builder', 'Delivery Board', 'Proof Report'],
    workflow: ['Capture client pain', 'Map workflow and risk', 'Build small demo', 'Report measurable result']
  }
};

let activeModule = 'founder';
let activeTool = 0;

const title = document.getElementById('moduleTitle');
const summary = document.getElementById('moduleSummary');
const toolList = document.getElementById('toolList');
const workflowPanel = document.getElementById('workflowPanel');

function render() {
  const data = modules[activeModule];
  title.textContent = data.title;
  summary.textContent = data.summary;
  toolList.innerHTML = data.tools.map((tool, index) => `<button class="tool-pill ${index === activeTool ? 'active' : ''}" data-tool="${index}">${tool}</button>`).join('');
  workflowPanel.innerHTML = `<strong>${data.tools[activeTool]}</strong><ul>${data.workflow.map(step => `<li>${step}</li>`).join('')}</ul>`;
}

document.querySelectorAll('.module-button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.module-button').forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    activeModule = button.dataset.module;
    activeTool = 0;
    render();
  });
});

toolList.addEventListener('click', event => {
  const button = event.target.closest('[data-tool]');
  if (!button) return;
  activeTool = Number(button.dataset.tool);
  render();
});

document.getElementById('generateBlueprint').addEventListener('click', () => {
  const input = document.getElementById('blueprintInput').value.trim() || 'Aimar operating module';
  const output = [
    `SYSTEM: ${input}`,
    '',
    'LAYER 01 / MODULE',
    `- Define ${input} as a bounded operating surface.`,
    '- Identify owner, audience, inputs, outputs, and risk boundary.',
    '',
    'LAYER 02 / TOOLS',
    '- Intake tool',
    '- Classification tool',
    '- Decision support tool',
    '- Reporting / proof tool',
    '',
    'LAYER 03 / WORKFLOW',
    '- Ingest signal',
    '- Normalize context',
    '- Route to human / assist / auto path',
    '- Apply approval gate',
    '- Log output and next action',
    '',
    'LAYER 04 / GOVERNANCE',
    '- Share-safe by default',
    '- Read-only before write-back',
    '- Audit trail required'
  ].join('\n');
  document.getElementById('blueprintOutput').textContent = output;
});

render();
