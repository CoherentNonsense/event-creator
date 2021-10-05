let currentRoom = null;
let rooms = [];


const roomList = document.getElementById("room-list");
function renderRooms()
{
  roomList.innerHTML = "";
  rooms.forEach((room) => {
    const roomHTML = document.createElement("input");
    roomHTML.type = "button";
    roomHTML.classList = "room-item";
    roomHTML.onclick = () => { selectRoom(room) };
    roomHTML.value = room.id;
    if (room.id === currentRoom.id) roomHTML.style.fontWeight = "bold";
    roomList.append(roomHTML);
  });
}

const idInput = document.getElementById("room-id");
const titleInput = document.getElementById("room-title");
const bodyInput = document.getElementById("room-body");
const hasExitHTML = document.getElementById("room-has-exit");
const isLootableHTML = document.getElementById("room-is-lootable");
const hasVisitedHTML = document.getElementById("room-has-visited");
function renderText()
{
  idInput.value = currentRoom.id;
  titleInput.value = currentRoom.title;
  bodyInput.value = currentRoom.body;
  hasExitHTML.checked = currentRoom.hasExit;
  isLootableHTML.checked = currentRoom.type === 1;
  hasVisitedHTML.checked = currentRoom.hasVisited;
}

const corridorList = document.getElementById("corridor-list");
function rendercorridors()
{
  corridorList.innerHTML = "";
  currentRoom.corridors.forEach((corridor, index) => {
    const corridorHTML = document.createElement("div");
    corridorHTML.classList = "corridor-item";
    // Remove
    const removeHTML = document.createElement("input");
    removeHTML.type = "button";
    removeHTML.value = "x";
    removeHTML.style.padding = "0 5px";
    removeHTML.style.boxSizing = "border-box";
    removeHTML.style.marginBottom = "5px";
    removeHTML.style.display = "block";
    removeHTML.onclick = () => {
      currentRoom.corridors.splice(index, 1);
      render();
    };
    // Text
    const corridorTextHTML = document.createElement("input");
    corridorTextHTML.type = "text";
    corridorTextHTML.placeholder = "text";
    corridorTextHTML.value = corridor.text;
    corridorTextHTML.onchange = () => { corridor.text = corridorTextHTML.value; render(); };
    // Select
    const corridorForHTML = document.createElement("select");
    corridorForHTML.innerHTML = "<option>corridor to...</option>";
    rooms.forEach((room) => {
      if (room.id === currentRoom.id) return;
      const optionHTML = document.createElement("option");
      if (room.id === corridor.for) optionHTML.selected = "true";
      optionHTML.innerHTML = room.id;
      corridorForHTML.append(optionHTML);
    });
    corridorForHTML.onchange = (e) => { corridor.for = e.target.value; render(); };
    // Req
    const reqHTML = document.createElement("input");
    reqHTML.type = "checkbox";
    const labelHTML = document.createElement("label");
    labelHTML.for = `corridor-req-${index}`;
    labelHTML.innerHTML = "<p>require item(s)</p>";
    reqHTML.id = `corridor-req-${index}`
    reqHTML.checked = corridor.req;
    reqHTML.onchange = (e) => { corridor.req = e.target.checked; render(); };
    
    labelHTML.append(reqHTML);
    // DONE
    corridorHTML.append(removeHTML);
    corridorHTML.append(corridorTextHTML);
    corridorHTML.append(corridorForHTML);
    corridorHTML.append(labelHTML);
    if (reqHTML.checked)
    {
      // Consume
      const consumeHTML = document.createElement("input");
      const consumeLabel = document.createElement("label");
      consumeLabel.innerHTML = "<p>consume items</p>";
      consumeHTML.type = "checkbox";
      consumeLabel.append(consumeHTML);
      consumeHTML.checked = corridor.reqConsume;
      consumeHTML.onchange = (e) => { corridor.reqConsume = e.target.checked; render(); };
      corridorHTML.append(consumeLabel);

      // Hide
      const hideHTML = document.createElement("input");
      const hideLabel = document.createElement("label");
      hideLabel.innerHTML = "<p>hide if locked</p>";
      hideHTML.type = "checkbox";
      hideLabel.append(hideHTML);
      hideHTML.checked = corridor.hide;
      hideHTML.onchange = (e) => { corridor.hide = e.target.checked; render(); };
      corridorHTML.append(hideLabel);

      // ReqForAll
      const reqForAllHTML = document.createElement("input");
      const reqForAllLabel = document.createElement("label");
      reqForAllLabel.innerHTML = "<p>require for all</p>";
      reqForAllHTML.type = "checkbox";
      reqForAllLabel.append(reqForAllHTML);
      reqForAllHTML.checked = corridor.reqForAll;
      reqForAllHTML.onchange = (e) => { corridor.reqForAll = e.target.checked; render(); };
      corridorHTML.append(reqForAllLabel);

      // ReqTarget
      const reqTargetLabel = document.createElement("label");
      reqTargetLabel.innerText = "require target ";
      const reqTargetHTML = document.createElement("select");
      reqTargetHTML.innerHTML = "<option>no target</option>";
      rooms.forEach((room) => {
        if (room.id === currentRoom.id) return;
        const optionHTML = document.createElement("option");
        if (room.id === corridor.reqTarget) optionHTML.selected = "true";
        optionHTML.innerHTML = room.id;
        reqTargetHTML.append(optionHTML);
      });
      reqTargetHTML.onchange = (e) => { corridor.reqTarget = e.target.value; render(); };
      reqTargetLabel.append(reqTargetHTML)
      corridorHTML.append(reqTargetLabel);

      // Lock Target
      const lockTargetLabel = document.createElement("label");
      lockTargetLabel.innerText = "lock target ";
      const lockTargetHTML = document.createElement("select");
      lockTargetHTML.innerHTML = "<option>no target</option>";
      rooms.forEach((room) => {
        if (room.id === currentRoom.id) return;
        const optionHTML = document.createElement("option");
        if (room.id === corridor.lockTarget) optionHTML.selected = "true";
        optionHTML.innerHTML = room.id;
        lockTargetHTML.append(optionHTML);
      });
      lockTargetHTML.onchange = (e) => { corridor.lockTarget = e.target.value; render(); };
      lockTargetLabel.append(lockTargetHTML);
      corridorHTML.append(lockTargetLabel);

      
        
      // Items
      const addReqItem = document.createElement("input");
      addReqItem.type = "button";
      addReqItem.value = "add item";
      addReqItem.onclick = () => {
        corridor.reqItems.push({ id: "", title: "", count: 0 });
        render();
      };
      corridorHTML.append(addReqItem);
      corridor.reqItems.forEach((reqItem, index) => {
        const itemContainer = document.createElement("div");
        itemContainer.classList = "corridor-item";
        // Remove
        const removeHTML = document.createElement("input");
        removeHTML.type = "button";
        removeHTML.value = "x";
        removeHTML.style.padding = "0 5px";
        removeHTML.style.boxSizing = "border-box";
        removeHTML.style.marginBottom = "5px";
        removeHTML.style.display = "block";
        removeHTML.onclick = () => {
          corridor.reqItems.splice(index, 1);
          render();
        };
        // ID
        const itemIdHTML = document.createElement("input");
        itemIdHTML.placeholder = "item id";
        itemIdHTML.value = reqItem.id;
        itemIdHTML.onchange = () => { reqItem.id = itemIdHTML.value; render(); };
        // Title
        const itemTitleHTML = document.createElement("input");
        itemTitleHTML.placeholder = "item title";
        itemTitleHTML.value = reqItem.title;
        itemTitleHTML.onchange = () => { reqItem.title = itemTitleHTML.value; render(); };
        // Count
        const countLabel = document.createElement("label");
        const countHTML = document.createElement("input");
        countLabel.innerHTML = "<p>count</p>";
        countHTML.type = "number";
        countHTML.style.width = "50px";
        countHTML.value = reqItem.count;
        countHTML.oninput = () => {
          if (!isNaN(countHTML.value)) {
            const newCount = parseInt(countHTML.value);
            if (newCount > -1)
            {
              reqItem.count = newCount;
            }
            render() 
          }
        };
        countLabel.append(countHTML);
        itemContainer.append(removeHTML);
        itemContainer.append(itemIdHTML);
        itemContainer.append(itemTitleHTML);
        itemContainer.append(countLabel);
        corridorHTML.append(itemContainer);
      });

      
    }
    corridorList.append(corridorHTML);
  });
}

const lootList = document.getElementById("loot-list");
const lootNextId = document.getElementById("loot-next-id-select");
function renderLoot()
{
  lootList.innerHTML = "";
  lootNextId.innerHTML = "";
  currentRoom.lootTable.forEach((loot, index) => {
    const lootHTML = document.createElement("div");
    lootHTML.classList = "corridor-item";
    // Remove
    const removeHTML = document.createElement("input");
    removeHTML.type = "button";
    removeHTML.value = "x";
    removeHTML.style.padding = "0 5px";
    removeHTML.style.boxSizing = "border-box";
    removeHTML.style.marginBottom = "5px";
    removeHTML.style.display = "block";
    removeHTML.onclick = () => {
      currentRoom.lootTable.splice(index, 1);
      render();
    };
    //ID
    const itemIdHTML = document.createElement("select");
    for (const itemId of Items.getItemIds())
    {
      const itemOptionHTML = document.createElement("option");
      itemOptionHTML.innerHTML = itemId;
      if (itemId == loot.id)
      {
        itemOptionHTML.selected = true;
      }
      itemIdHTML.append(itemOptionHTML);
    }
    itemIdHTML.onchange = (e) => { loot.id = e.target.value; render(); };
    // MIN/MAX/CHANCE
    const minLabel = document.createElement("label");
    const maxLabel = document.createElement("label");
    const chanceLabel = document.createElement("label");
    const minHTML = document.createElement("input");
    const maxHTML = document.createElement("input");
    const chanceHTML = document.createElement("input");
    minLabel.innerHTML = "<p>min</p>";
    maxLabel.innerHTML = "<p>max</p>";
    chanceLabel.innerHTML = "<p>chance</p>";
    minHTML.type = "number";
    maxHTML.type = "number";
    minHTML.style.width = "50px";
    maxHTML.style.width = "50px";
    chanceHTML.style.width = "50px";
    minHTML.value = loot.min;
    maxHTML.value = loot.max;
    chanceHTML.value = loot.chance;
    minHTML.onchange = () => {
      if (!isNaN(minHTML.value)) {
        const newMin = parseInt(minHTML.value);
        if (newMin > -1)
        {
          loot.min = newMin;
          if (loot.min > loot.max) loot.max = loot.min;
        }
      }
      render() 
    };
    maxHTML.onchange = () => {
      if (!isNaN(maxHTML.value)) {
        const newMax = parseInt(maxHTML.value);
        if (newMax > 0)
        {
          loot.max = newMax;
          if (loot.max < loot.min) loot.min = loot.max;
        }
      }
      render()
    };
    chanceHTML.onchange = () => {
      if (!isNaN(chanceHTML.value)) {
        const newChance = parseFloat(chanceHTML.value);
        if (newChance > 0)
        {
          loot.chance = newChance;
        }
      }
      render()
    };
    minLabel.append(minHTML);
    maxLabel.append(maxHTML);
    chanceLabel.append(chanceHTML);

    lootHTML.append(removeHTML);
    lootHTML.append(itemIdHTML);
    lootHTML.append(minLabel);
    lootHTML.append(maxLabel);
    lootHTML.append(chanceLabel);
    lootList.append(lootHTML);
  });

  // NextId
  lootNextId.innerHTML = "<option>exit to...</option>"
  rooms.forEach((room) => {
    if (room.id === currentRoom.id) return;
    const optionHTML = document.createElement("option");
    optionHTML.innerText = room.id;
    if (room.id === currentRoom.nextId) optionHTML.selected = true;
    lootNextId.onchange = (e) => { currentRoom.nextId = e.target.value === "exit to..." ? "leave" : e.target.value; render(); };
    lootNextId.append(optionHTML);
  });
}

const hasVisitedContainerHTML = document.getElementById("has-visited-container");
const visitedTargetHTML = document.getElementById("has-visited-target-select");
const visitedBodyInput = document.getElementById("room-visited-body");
function renderHasVisited()
{
  hasVisitedContainerHTML.style.display = currentRoom.hasVisited ? "block" : "none";

  // Visited Target
  visitedTargetHTML.innerHTML = "";
  visitedTargetHTML.innerHTML = "<option>target...</option>";
  rooms.forEach((room) => {
    if (room.id === currentRoom.id) return;
    const optionHTML = document.createElement("option");
    if (room.id === currentRoom.visitTarget) optionHTML.selected = "true";
    optionHTML.innerHTML = room.id;
    visitedTargetHTML.append(optionHTML);
  });
  visitedTargetHTML.onchange = (e) => { currentRoom.visitTarget = e.target.value; render(); };
}

const displayHTML = document.getElementById("room-preview");
const jsonContainer = document.getElementById("json-container");
const previewContainer = document.getElementById("event-container");
const previewTitle = document.getElementById("event-title");
const previewBody = document.getElementById("event-body");
const previewLoot = document.getElementById("event-loot");
const previewBtns = document.getElementById("event-btns");
function renderPreview()
{
  // RENDER JSON
  if (!isPreview)
  {
    jsonContainer.style.display = "block";
    previewContainer.style.display = "none";
    jsonContainer.innerText = toJSON();
    return;
  }
  else
  {
    jsonContainer.style.display = "none";
    previewContainer.style.display = "block";
  }
  
  currentRoom.render();

  // RENDER PREVIEW
  previewTitle.innerText = currentRoom.title.length === 0 ? "Empty" : currentRoom.title;
  previewBody.innerHTML = currentRoom.bodyRendered;
  if (currentRoom.hasVisited)
  {
    const visitTarget = (currentRoom.visitTarget && currentRoom.visitTarget !== "choose target...") ? currentRoom.visitTarget : "this room";
    previewBody.innerHTML += `<div class="bold-n-spicy">after visiting ${visitTarget}:</div>${currentRoom.visitedBodyRendered}`;
  }

  // Event btns
  previewBtns.innerHTML = "";
  if (currentRoom.type === 0)
  {
    currentRoom.corridors.forEach((corridor) => {
      const forRoomIndex = rooms.findIndex((room) => room.id === corridor.for);
      const forRoom = rooms[forRoomIndex];
      const btnHTML = document.createElement("li");
      const divOne = document.createElement("div");
      const divTwo = document.createElement("div");
      const btnText = document.createElement("a");
      btnHTML.classList = "li-btn";
      divOne.classList = "divone-btn";
      divTwo.classList = "divtwo-btn";
      if (forRoom) divTwo.onclick = () => { currentRoom = forRoom; render(); }
      if (!corridor.req)
      {
        btnText.innerText = corridor.text;
    
        divTwo.append(btnText);
      }
      else
      {
        btnText.innerText = corridor.text;
        divTwo.append(btnText);

        const reqContainer = document.createElement("div");
        reqContainer.classList = "req-container";
        reqContainer.append(document.createElement("hr"));
        if (corridor.reqForAll) reqContainer.innerHTML += "(required for everyone)<br>";
        if (corridor.hide) reqContainer.innerHTML += "(hidden when locked)<br>";
        reqContainer.append("requires:");
        const ulHTML = document.createElement("ul");
        corridor.reqItems.forEach((reqItem) => {
          const liHTML = document.createElement("li");
          liHTML.innerText = `(${reqItem.count}x) ${reqItem.title}`;
          liHTML.style.marginLeft = "20px";
          ulHTML.append(liHTML);
        });
        reqContainer.append(ulHTML);
        reqContainer.append(corridor.reqConsume ? "this item will be removed from your inventory" : "you will not lose this item.");
        divTwo.append(reqContainer);
      }

      divOne.append(divTwo);
      btnHTML.append(divOne);
      previewBtns.append(btnHTML);

    });
  }
  else
  {
    previewLoot.innerHTML = "";
    const listHTML = document.createElement("ul");
    currentRoom.lootTable.forEach((loot) => {
      const lootHTML = document.createElement("li");
      const chance = Math.min(100, loot.chance * 100);
      const lootCount = loot.min === loot.max ? loot.min : `${loot.min}-${loot.max}`;
      lootHTML.innerText = `${chance}% chance of containing ${lootCount} ${loot.id}`;
      listHTML.append(lootHTML);
    });
    previewLoot.append(listHTML);

    if (!currentRoom.hasExit)
    {
      const forRoomIndex = rooms.findIndex((room) => room.id === currentRoom.nextId);
      const forRoom = rooms[forRoomIndex];
      const btnHTML = document.createElement("li");
      const divOne = document.createElement("div");
      const divTwo = document.createElement("div");
      const btnText = document.createElement("a");
      btnHTML.classList = "li-btn";
      divOne.classList = "divone-btn";
      divTwo.classList = "divtwo-btn";
      btnText.innerText = "continue";
      if (forRoom) btnText.onclick = () => { currentRoom = forRoom; render(); }

      divTwo.append(btnText);
      divOne.append(divTwo);
      btnHTML.append(divOne);
      previewBtns.append(btnHTML);
    }
  }
  if (currentRoom.hasExit)
  {
    const btnHTML = document.createElement("li");
    const divOne = document.createElement("div");
    const divTwo = document.createElement("div");
    const btnText = document.createElement("a");
    btnHTML.classList = "li-btn";
    divOne.classList = "divone-btn";
    divTwo.classList = "divtwo-btn";
    btnText.innerText = "exit";

    divTwo.append(btnText);
    divOne.append(divTwo);
    btnHTML.append(divOne);
    previewBtns.append(btnHTML);
  }
}

const lootHTML = document.getElementById("loot-container");
const corridorHTML = document.getElementById("corridors-container");
function render()
{
  renderRooms();
  renderText();
  renderHasVisited();
  renderPreview();
  
  if (currentRoom.type === 0)
  {
    rendercorridors();
    lootHTML.style.display = "none";
    corridorHTML.style.display = "block";
    previewLoot.style.display = "none";
  }
  else
  {
    renderLoot();
    lootHTML.style.display = "block";
    corridorHTML.style.display = "none";
    previewLoot.style.display = "block";
  }
  
  if (currentRoom.type === 1 && !currentRoom.hasExit)
  {
    lootNextId.style.display = "block";
  }
  else
  {    
    lootNextId.style.display = "none";
  }
}

function selectRoom(room)
{
  currentRoom = room;
  render();
}

function save()
{
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([toJSON()], {
    type: "application/json"
  }));
  a.setAttribute("download", `${eventIdHTML.value}.json`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function load(json)
{
  let eventObj = null;
  try
  {
    eventObj = JSON.parse(json);
    if (!eventObj.rooms.main) throw new Error("Missing main room");
  }
  catch(e)
  {
    alert("Event format is incorrect: (Check console)")
    console.log(e);
  }

  if (!eventObj) return;

  if (confirm("Event loaded. You will lose all current progress."))
  {
    eventIdHTML.value = eventObj.id;
    eventWeightHTML.value = eventObj.weight;
    rooms = [];
    Object.values(eventObj.rooms).forEach((roomObj) => {
      const newRoom = new Room(roomObj);
      if (roomObj.id === "main") currentRoom = newRoom;
      rooms.push(newRoom);
    });
    render();
  }
}

const eventIdHTML = document.getElementById("event-id");
const eventWeightHTML = document.getElementById("event-weight");
function toJSON()
{
  const jsonObj = {};
  if (eventIdHTML.value.length === 0) return alert("an event name is required.");
  jsonObj.id = eventIdHTML.value;
  if (eventWeightHTML.value.length === 0) return alert("an event weight is required.");
  jsonObj.weight = eventWeightHTML.value;
  
  let hasMain = false;
  const roomsObj = {};
  rooms.forEach((room) => {
    if (room.id === "main") hasMain = true;
    roomsObj[room.id] = room.generateJSON();
  });

  if (!hasMain)
  {
    return alert("one room must have the id main where the player will start.");
  }

  jsonObj.rooms = roomsObj

  return JSON.stringify(jsonObj, null, 2);
}

function main()
{
  const defaultRoom = new Room()
  defaultRoom.id = "main";
  defaultRoom.title = "starting room";
  defaultRoom.body = "a small room";
  defaultRoom.hasExit = true;
  defaultRoom.type = 0;

  rooms.push(defaultRoom);
  currentRoom = defaultRoom;

  render();
}

// Events
document.getElementById("new-room-btn").onclick = () => {
  const newRoom = new Room();
  rooms.push(newRoom);
  currentRoom = newRoom;
  
  render();
};

idInput.oninput = () => delayedRender(0, () => currentRoom.setId(idInput.value));
titleInput.oninput = () => delayedRender(1, () => currentRoom.title = titleInput.value);
bodyInput.oninput = () => delayedRender(2, () => currentRoom.body = bodyInput.value);
visitedBodyInput.oninput = () => delayedRender(10, () => currentRoom.visitedBody = visitedBodyInput.value);
visitedBodyInput.value = "";

hasExitHTML.onchange = (e) => {
  currentRoom.hasExit = e.target.checked;
  render();
};

isLootableHTML.onchange = (e) => {
  currentRoom.type = e.target.checked ? 1 : 0;
  render();
};

hasVisitedHTML.onchange = (e) => {
  currentRoom.hasVisited = e.target.checked;
  render();
}

document.getElementById("add-corridor-btn").onclick = () => {
  currentRoom.addcorridor("", "corridor");
  render();
};

document.getElementById("add-loot-btn").onclick = () => {
  currentRoom.addLoot({ id: "", min: 0, max: 0, chance: 0 });
  render();
}

document.getElementById("delete-room-btn").onclick = () => {
  if (rooms.length === 1) return alert("one room is required.");
  let index = rooms.findIndex((room) => room.id === currentRoom.id);
  rooms.splice(index, 1);
  if (index > 0) --index;
  currentRoom = rooms[index];
  render();
}

document.getElementById("save-btn").onclick = () => { save() };

let isPreview = true;
const viewBtn = document.getElementById("view-json-btn");
viewBtn.onclick = () => { isPreview = !isPreview; viewBtn.innerText = isPreview ? "view json" : "view preview"; render(); };

eventIdHTML.onchange = () => { if (!isPreview) render() };
eventWeightHTML.onchange = () => { if (!isPreview) render() };

// Load event json
document.getElementById("json-file").onchange = () => {
  let file = document.querySelector("#json-file").files[0];
  let reader = new FileReader();
  reader.addEventListener('load', function(e) {
        let text = e.target.result;
        load(text);
  });
  reader.readAsText(file);
};


// Load item ids
document.getElementById("item-json-file").onchange = () => {
  let file = document.querySelector("#item-json-file").files[0];
  let reader = new FileReader();
  reader.addEventListener('load', function(e) {
        Items.loadItemIds(e.target.result);
  });
  reader.readAsText(file);
};

main();


// UTIL

const delays = [];
function delayedRender(timerId, callback, delay = 500)
{
  delays[timerId] = Date.now() + delay - 50;
  setTimeout(() => {
    if (delays[timerId] > Date.now()) return;
    callback();
    render();
  }, delay);
}