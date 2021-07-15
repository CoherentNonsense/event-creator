let currentRoom = null;
const rooms = [];


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
function renderText()
{
  idInput.value = currentRoom.id;
  titleInput.value = currentRoom.title;
  bodyInput.value = currentRoom.body;
  hasExitHTML.checked = currentRoom.hasExit;
  isLootableHTML.checked = currentRoom.type === 1;
}

const corridoreList = document.getElementById("corridore-list");
function renderCorridores()
{
  corridoreList.innerHTML = "";
  currentRoom.corridores.forEach((corridore, index) => {
    const corridoreHTML = document.createElement("div");
    corridoreHTML.classList = "corridore-item";
    // Remove
    const removeHTML = document.createElement("input");
    removeHTML.type = "button";
    removeHTML.value = "x";
    removeHTML.style.padding = "0 5px";
    removeHTML.style.boxSizing = "border-box";
    removeHTML.style.marginBottom = "5px";
    removeHTML.style.display = "block";
    removeHTML.onclick = () => {
      currentRoom.corridores.splice(index, 1);
      render();
    };
    // Text
    const corridoreTextHTML = document.createElement("input");
    corridoreTextHTML.type = "text";
    corridoreTextHTML.placeholder = "text";
    corridoreTextHTML.value = corridore.text;
    corridoreTextHTML.onchange = () => { corridore.text = corridoreTextHTML.value; render(); };
    // Select
    const corridoreForHTML = document.createElement("select");
    corridoreForHTML.innerHTML = "<option>corridore to...</option>";
    rooms.forEach((room) => {
      if (room.id === currentRoom.id) return;
      const optionHTML = document.createElement("option");
      if (room.id === corridore.for) optionHTML.selected = "true";
      optionHTML.innerHTML = room.id;
      corridoreForHTML.append(optionHTML);
    });
    corridoreForHTML.onchange = (e) => { corridore.for = e.target.value; render(); };
    // Req
    const reqHTML = document.createElement("input");
    reqHTML.type = "checkbox";
    const labelHTML = document.createElement("label");
    labelHTML.for = `corridore-req-${index}`;
    labelHTML.innerHTML = "<p>require item(s)</p>";
    reqHTML.id = `corridore-req-${index}`
    reqHTML.checked = corridore.req;
    reqHTML.onchange = (e) => { corridore.req = e.target.checked; render(); };
    
    labelHTML.append(reqHTML);
    // DONE
    corridoreHTML.append(removeHTML);
    corridoreHTML.append(corridoreTextHTML);
    corridoreHTML.append(corridoreForHTML);
    corridoreHTML.append(labelHTML);
    if (reqHTML.checked)
    {
      // Consume
      const consumeHTML = document.createElement("input");
      const consumeLabel = document.createElement("label");
      consumeLabel.innerHTML = "<p>consume items</p>";
      consumeHTML.type = "checkbox";
      consumeLabel.append(consumeHTML);
      consumeHTML.checked = corridore.reqConsume;
      consumeHTML.onchange = (e) => { corridore.reqConsume = e.target.checked; render(); };
      corridoreHTML.append(consumeLabel);
  
      
      // Items
      const addReqItem = document.createElement("input");
      addReqItem.type = "button";
      addReqItem.value = "add item";
      addReqItem.onclick = () => {
        corridore.reqItems.push({ id: "", title: "", count: 0 });
        render();
      };
      corridoreHTML.append(addReqItem);
      corridore.reqItems.forEach((reqItem, index) => {
        const itemContainer = document.createElement("div");
        itemContainer.classList = "corridore-item";
        // Remove
        const removeHTML = document.createElement("input");
        removeHTML.type = "button";
        removeHTML.value = "x";
        removeHTML.style.padding = "0 5px";
        removeHTML.style.boxSizing = "border-box";
        removeHTML.style.marginBottom = "5px";
        removeHTML.style.display = "block";
        removeHTML.onclick = () => {
          corridore.reqItems.splice(index, 1);
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
        corridoreHTML.append(itemContainer);
      });

      
    }
    corridoreList.append(corridoreHTML);
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
    lootHTML.classList = "corridore-item";
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
    const itemIdHTML = document.createElement("input");
    itemIdHTML.placeholder = "item id";
    itemIdHTML.value = loot.id;
    itemIdHTML.onchange = () => { loot.id = itemIdHTML.value; render(); };
    // MIN/MAX
    const minLabel = document.createElement("label");
    const maxLabel = document.createElement("label");
    const minHTML = document.createElement("input");
    const maxHTML = document.createElement("input");
    minLabel.innerHTML = "<p>min</p>";
    maxLabel.innerHTML = "<p>max</p>";
    minHTML.type = "number";
    maxHTML.type = "number";
    minHTML.style.width = "50px";
    maxHTML.style.width = "50px";
    minHTML.value = loot.min;
    maxHTML.value = loot.max;
    minHTML.oninput = () => {
      if (!isNaN(minHTML.value)) {
        const newMin = parseInt(minHTML.value);
        if (newMin > -1)
        {
          loot.min = newMin;
          if (loot.min > loot.max) loot.max = loot.min;
        }
        render() 
      }
    };
    maxHTML.oninput = () => {
      if (!isNaN(maxHTML.value)) {
        const newMax = parseInt(maxHTML.value);
        if (newMax > 0)
        {
          loot.max = newMax;
          if (loot.max < loot.min) loot.min = loot.max;
        }
        render()
      }
    };
    minLabel.append(minHTML);
    maxLabel.append(maxHTML);

    lootHTML.append(removeHTML);
    lootHTML.append(itemIdHTML);
    lootHTML.append(minLabel);
    lootHTML.append(maxLabel);
    lootList.append(lootHTML);
  });

  // NextId
  lootNextId.innerHTML = "<option>exit to...</option>"
  rooms.forEach((room) => {
    if (room.id === currentRoom.id) return;
    const optionHTML = document.createElement("option");
    optionHTML.innerText = room.id;
    if (room.id === currentRoom.nextId) optionHTML.selected = true;
    lootNextId.onchange = (e) => { currentRoom.nextId = e.target.value; render(); };
    lootNextId.append(optionHTML);
  });
}


const previewTitle = document.getElementById("event-title");
const previewBody = document.getElementById("event-body");
const previewLoot = document.getElementById("event-loot");
const previewBtns = document.getElementById("event-btns");
function renderPreview()
{
  previewTitle.innerText = currentRoom.title.length === 0 ? "Empty" : currentRoom.title;
  previewBody.innerText = currentRoom.body.length === 0 ? "Empty" : currentRoom.body;

  // Event btns
  previewBtns.innerHTML = "";
  if (currentRoom.type === 0)
  {
    currentRoom.corridores.forEach((corridore) => {
      const forRoomIndex = rooms.findIndex((room) => room.id === corridore.for);
      const forRoom = rooms[forRoomIndex];
      const btnHTML = document.createElement("li");
      const divOne = document.createElement("div");
      const divTwo = document.createElement("div");
      const btnText = document.createElement("a");
      btnHTML.classList = "li-btn";
      divOne.classList = "divone-btn";
      divTwo.classList = "divtwo-btn";
      btnText.onclick = () => { currentRoom = forRoom; render(); }
      if (!corridore.req)
      {
        btnText.innerText = corridore.text;
    
        divTwo.append(btnText);
      }
      else
      {
        btnText.innerText = corridore.text;
        divTwo.append(btnText);

        const reqContainer = document.createElement("div");
        reqContainer.classList = "req-container";
        reqContainer.append(document.createElement("hr"));
        reqContainer.append("requires:");
        const ulHTML = document.createElement("ul");
        corridore.reqItems.forEach((reqItem) => {
          const liHTML = document.createElement("li");
          liHTML.innerText = `(${reqItem.count}x) ${reqItem.title}`;
          liHTML.style.marginLeft = "20px";
          ulHTML.append(liHTML);
        });
        reqContainer.append(ulHTML);
        reqContainer.append(corridore.reqConsume ? "this item will be removed from your inventory" : "you will not lose this item.");
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
      const chance = Math.max(100, loot.chance * 100);
      const lootCount = loot.min === loot.max ? loot.min : `${loot.min}-${loot.max}`;
      lootHTML.innerText = `${chance}% chance of containing ${lootCount} ${loot.id}`;
      listHTML.append(lootHTML);
    });
    previewLoot.append(listHTML);

    if (!currentRoom.hasExit)
    {
      const btnHTML = document.createElement("li");
      const divOne = document.createElement("div");
      const divTwo = document.createElement("div");
      const btnText = document.createElement("a");
      btnHTML.classList = "li-btn";
      divOne.classList = "divone-btn";
      divTwo.classList = "divtwo-btn";
      btnText.innerText = currentRoom.nextId;

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
const corridoreHTML = document.getElementById("corridores-container");
function render()
{
  renderRooms();
  renderText();
  renderPreview();
  
  if (currentRoom.type === 0)
  {
    renderCorridores();
    lootHTML.style.display = "none";
    corridoreHTML.style.display = "block";
    previewLoot.style.display = "none";
  }
  else
  {
    renderLoot();
    lootHTML.style.display = "block";
    corridoreHTML.style.display = "none";
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

const eventIdHTML = document.getElementById("event-id");
const eventWeightHTML = document.getElementById("event-weight");
function save()
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

  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(jsonObj, null, 2)], {
    type: "application/json"
  }));
  a.setAttribute("download", `${jsonObj.id}.json`);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
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

hasExitHTML.onchange = (e) => {
  currentRoom.hasExit = e.target.checked;
  render();
};

isLootableHTML.onchange = (e) => {
  currentRoom.type = e.target.checked ? 1 : 0;
  render();
};

document.getElementById("add-corridore-btn").onclick = () => {
  currentRoom.addCorridore("", "corridore");
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