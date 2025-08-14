
const data = JSON.parse(document.getElementById('site-data').textContent);

const tabsEl = document.getElementById('tabs');
const gridEl = document.getElementById('grid');
const searchEl = document.getElementById('search');

let currentSection = Object.keys(data)[0] || '';
let query = '';

function renderTabs(){
  tabsEl.innerHTML = '';
  Object.keys(data).forEach((section)=>{
    const btn = document.createElement('button');
    btn.className = 'tab' + (section===currentSection ? ' active':'');
    btn.textContent = section;
    btn.addEventListener('click', ()=>{ currentSection = section; render(); window.scrollTo({top:0,behavior:'smooth'}); });
    tabsEl.appendChild(btn);
  });
}

function normalize(s){ return (s||'').toLowerCase().trim(); }

function renderGrid(){
  gridEl.innerHTML = '';
  const items = data[currentSection] || [];
  const q = normalize(query);
  const filtered = q ? items.filter(it => normalize(it.title).includes(q) || JSON.stringify(it.extras).toLowerCase().includes(q)) : items;

  if(filtered.length===0){
    const empty = document.createElement('div');
    empty.className = 'card';
    empty.innerHTML = '<h3>Ничего не найдено</h3><p>Попробуйте изменить запрос или переключить вкладку.</p>';
    gridEl.appendChild(empty);
    return;
  }

  filtered.forEach((it, idx)=>{
    const card = document.createElement('div');
    card.className = 'card';

    const h3 = document.createElement('h3');
    h3.textContent = it.title || ('Элемент ' + (idx+1));
    card.appendChild(h3);

    const extrasList = Object.entries(it.extras || {}).filter(([k,v]) => v && v.toLowerCase()!=='nan');
    if(extrasList.length){
      const p = document.createElement('p');
      p.innerHTML = extrasList.slice(0,3).map(([k,v]) => `<span class="badge">${k}: ${v}</span>`).join(' ');
      card.appendChild(p);
    }

    const link = document.createElement('a');
    link.className = 'button';
    if(it.url){
      link.href = it.url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = 'Открыть видео';
    }else{
      link.href = '#';
      link.setAttribute('aria-disabled', 'true');
      link.textContent = 'Ссылка отсутствует';
      link.style.opacity = .6;
      link.style.pointerEvents = 'none';
    }
    card.appendChild(link);

    gridEl.appendChild(card);
  });
}

function render(){
  renderTabs();
  renderGrid();
}

searchEl.addEventListener('input', (e)=>{ query = e.target.value; renderGrid(); });

render();
