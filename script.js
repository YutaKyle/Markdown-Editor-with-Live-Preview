const editor = document.getElementById('editor');
const preview = document.getElementById('preview');
const stats = document.getElementById('stats');

marked.setOptions({
  highlight: function(code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  }
});

const savedDraft = localStorage.getItem('md-draft');
if (savedDraft) {
  editor.value = savedDraft;
} else {
  editor.value = `# Welcome to your Advanced Markdown Editor!\n\nThis upgraded version includes syntax highlighting, HTML exports, line tracking, and focus mode.\n\n\`\`\`javascript\nfunction greet(name) {\n  console.log("Hello, " + name + "!");\n}\n\`\`\`\n\n* Real-time rendering\n* Export to **.md** or **.html**\n* Toggle Focus Mode for zero distractions`;
}

function updateEditor() {
  const text = editor.value;
  preview.innerHTML = marked.parse(text);
  localStorage.setItem('md-draft', text);

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const lines = text ? text.split('\n').length : 0;
  const paras = text.trim() ? text.trim().split(/\n\s*\n/).length : 0;

  stats.textContent = `Words: ${words} | Chars: ${chars} | Lines: ${lines} | Paras: ${paras}`;
}

function insertText(before, after = '') {
  const start = editor.selectionStart;
  const end = editor.selectionEnd;
  const selectedText = editor.value.substring(start, end);
  const replacement = before + selectedText + after;

  editor.value = editor.value.substring(0, start) + replacement + editor.value.substring(end);
  editor.focus();
  editor.selectionEnd = start + before.length + selectedText.length;
  updateEditor();
}

function downloadFile(type) {
  const content = type === 'html' 
    ? `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Exported Document</title></head><body>${preview.innerHTML}</body></html>`
    : editor.value;
  
  const blob = new Blob([content], { type: type === 'html' ? 'text/html' : 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `document.${type}`;
  a.click();
  URL.revokeObjectURL(url);
}

function copyHTML() {
  navigator.clipboard.writeText(preview.innerHTML).then(() => {
    alert('Rendered HTML copied to clipboard!');
  });
}

function clearEditor() {
  if (confirm('Are you sure you want to clear your current draft?')) {
    editor.value = '';
    updateEditor();
  }
}

function toggleTheme() {
  const currentTheme = document.body.getAttribute('data-theme');
  document.body.setAttribute('data-theme', currentTheme === 'light' ? 'dark' : 'light');
}

function toggleFocus() {
  document.body.classList.toggle('focus-mode');
}

editor.addEventListener('input', updateEditor);
updateEditor();
