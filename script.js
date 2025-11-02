const CSV_URL = "data.csv";

let pokemons = [];

const typeFilter = document.getElementById("typeFilter");
const ingredientFilter = document.getElementById("ingredientFilter");
const specialtyFilter = document.getElementById("specialtyFilter");
const pokemonList = document.getElementById("pokemonList");
const sleepTypeFilter = document.getElementById("sleepTypeFilter");
const nameSearch = document.getElementById("nameSearch");
const evolutionFilter = document.getElementById("evolutionFilter");

function parseCSV(text) {
  const lines = text.trim().split("\n").filter(line => line.trim() !== "");
  const headers = lines[0].split(",");
  return lines.slice(1).map(line => {
    const values = line.split(",").slice(0, headers.length + 1);
    return {
      number: values[headers.indexOf("図鑑No.")]?.trim() || "",
      name: values[headers.indexOf("名前")]?.trim() || "",
      type: values[headers.indexOf("タイプ")]?.trim() || "",
      specialty: values[headers.indexOf("とくい")]?.trim() || "",
      ingredient: [
        values[headers.indexOf("第1食材")]?.trim() || "",
        values[headers.indexOf("第2食材")]?.trim() || "",
        values[headers.indexOf("第3食材")]?.trim() || ""
      ],
      sleepType: values[headers.indexOf("睡眠タイプ")]?.trim() || "",
      evolution: (values[headers.indexOf("進化段階")] || "").trim().replace(/[^0-9]/g, "")
    };
  });
}

function typeToImageName(type) {
  const map = {
    "ノーマル": "normal.png",
    "ほのお": "honoo.png",
    "みず": "mizu.png",
    "でんき": "denki.png",
    "くさ": "kusa.png",
    "こおり": "koori.png",
    "かくとう": "kakutou.png",
    "どく": "doku.png",
    "じめん": "jimen.png",
    "ひこう": "hikou.png",
    "エスパー": "esper.png",
    "むし": "mushi.png",
    "いわ": "iwa.png",
    "ゴースト": "ghost.png",
    "ドラゴン": "dragon.png",
    "あく": "aku.png",
    "はがね": "hagane.png",
    "フェアリー": "fairy.png"
  };
  return map[type] || "default.png";
}

function typeToBerryImageName(type) {
  const map = {
    "ノーマル": "key.png",
    "ほのお": "himeri.png",
    "みず": "oran.png",
    "でんき": "ubu.png",
    "くさ": "dori.png",
    "こおり": "chigo.png",
    "かくとう": "kurabo.png",
    "どく": "kago.png",
    "じめん": "fira.png",
    "ひこう": "shiya.png",
    "エスパー": "mago.png",
    "むし": "ramu.png",
    "いわ": "obon.png",
    "ゴースト": "buri.png",
    "ドラゴン": "yache.png",
    "あく": "ui.png",
    "はがね": "beribu.png",
    "フェアリー": "momon.png"
  };
  return map[type] || null;
}

function ingredientToImageName(name) {
  const map = {
    "あまいミツ": "amaimitsu.png",
    "あったかジンジャー": "attakajinja.png",
    "モーモーミルク": "moomoomilk.png",
    "ほっこりポテト": "hokkoripotato.png",
    "とくせんリンゴ": "tokusenringo.png",
    "マメミート": "mamemeat.png",
    "ピュアなオイル": "purenaoil.png",
    "リラックスカカオ": "relaxcacao.png",
    "とくせんエッグ": "tokusenegg.png",
    "ふといながねぎ": "futoinaganegi.png",
    "あじわいキノコ": "ajiwaikinoko.png",
    "げきからハーブ": "gekikaraherb.png",
    "おいしいシッポ": "oishiishippo.png",
    "ワカクサ大豆": "wakakusadaizu.png",
    "ワカクサコーン": "wakakusacorn.png",
    "めざましコーヒー": "mezamashicoffee.png",
    "ずっしりかぼちゃ": "zushirikabocha.png",
    "あんみんトマト": "anmintomato.png"
  };
  return map[name] || "default.png";
}

function toHiragana(text) {
  return text.replace(/[\u30A1-\u30F6]/g, ch =>
    String.fromCharCode(ch.charCodeAt(0) - 0x60)
  );
}


function renderList() {
  const type = typeFilter.value;
  const ingredient = ingredientFilter.value;
  const specialty = specialtyFilter.value;
  const sleepType = sleepTypeFilter.value;
  const nameKeyword = toHiragana(nameSearch.value.trim());
  const evolution = evolutionFilter.value;

//console.log("evolutionFilter:", evolution);
// console.log("進化段階一覧:", pokemons.map(p => `${p.name}: [${p.evolution}]`));

  const filtered = pokemons.filter(p => {
    const matchesEvolution =
    !evolution ||
    (evolution === "final" && p.evolution === "1");

    return (!nameKeyword || toHiragana(p.name).includes(nameKeyword)) &&
      (!type || p.type === type) &&
      (!ingredient || p.ingredient.includes(ingredient)) &&
      (!specialty || p.specialty === specialty) &&
      (!sleepType || p.sleepType === sleepType) &&
      matchesEvolution;
  });

  pokemonList.innerHTML = "";
  filtered.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="images/pokemon/${String(p.number).padStart(4, '0')}.png" alt="${p.name}" class="pokemon-image" />
      <h3>${p.name}</h3>
      <p>タイプ: <img src="images/types/${typeToImageName(p.type)}" alt="${p.type}" class="type-icon" /></p>
      <p>きのみ: <img src="images/berries/${typeToBerryImageName(p.type)}" alt="${p.type}のきのみ" class="berry-icon" /></p>
      <p>食材</p>
      <div class="ingredient-images">
        ${p.ingredient
          .filter(name => name !== "ー")
          .map(name => `
            <img src="images/ingredients/${ingredientToImageName(name)}" alt="${name}" class="ingredient-icon" />
        `).join("")}
      </div>
      <p>とくい: <span class="specialty-badge specialty-${p.specialty}">${p.specialty}</span></p>
      <p>睡眠タイプ: <span class="sleep-badge sleep-${p.sleepType}">${p.sleepType}</span></p>
    `;
    pokemonList.appendChild(card);
  });
}

function loadPokemonData() {
  fetch(CSV_URL)
    .then(response => response.text())
    .then(csvText => {
      pokemons = parseCSV(csvText);
      renderList();
    })
    .catch(error => {
      console.error("CSV読み込みエラー:", error);
      pokemonList.innerHTML = `<p style="color:red;">データの読み込みに失敗しました。</p>`;
    });
}

typeFilter.addEventListener("change", renderList);
ingredientFilter.addEventListener("change", renderList);
specialtyFilter.addEventListener("change", renderList);
sleepTypeFilter.addEventListener("change", renderList);
nameSearch.addEventListener("input", renderList);
evolutionFilter.addEventListener("change", renderList);

loadPokemonData();