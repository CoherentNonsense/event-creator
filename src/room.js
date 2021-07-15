class Room
{
  constructor()
  {
    this.id = "new-room" + Math.random().toString().slice(2, 6);
    this.title = "";
    this.body = "";
    this.corridores = [];
    this.hasExit = false;
    this.reqForAll = true;
    this.type = 0;
    
    // Lootable
    this.nextId;
    this.size;
    this.lootTable = [];
  }

  setId(id)
  {
    this.id = id.replace(" ", "-");
  }

  addCorridore(roomId, text, reqItems = [], reqConsume = false)
  {
    if (this.type === 1)
    {
      if (this.nextId)
      {
        alert(this.id + ": a loot room can only have 1 corridore.");
        return;
      }

      this.nextId = roomId;
    }
    else
    {
      let corridore = null;
      corridore = { for: roomId, text, req: false, reqItems, reqConsume};

      this.corridores.push(corridore);
    }
  }

  removeCorridore(roomId)
  {
    const corridoreIndex = this.corridores.findIndex((corridore) => {
      corridore.for === roomId;
    });
    this.corridores.splice(corridoreIndex, 1);
  }

  setType(type)
  {
    this.type = type;
  }

  addLoot(loot)
  {
    if (this.type === 0) return;
    
    this.lootTable.push(loot);
  }

  setSize(size)
  {
    if (this.type === 0) return;

    this.size = size;
  }

  generateJSON()
  {
    const jsonObj = {};
    jsonObj.id = this.id;
    jsonObj.title = this.title;
    jsonObj.body = this.body;
    jsonObj.visitedBody = "clone";

    if (this.type === 0)
    {
      jsonObj.loot = false;
      const btnsObj = [];
      this.corridores.forEach((corridore) => {
        const btnObj = {};
        btnObj.for = corridore.for;
        btnObj.text = corridore.text;
        btnObj.req = corridore.req;
        if (btnObj.req)
        {
          btnObj.reqItems = corridore.reqItems;
          btnObj.reqConsume = corridore.reqConsume;
        }
        if (this.reqForAll)
        {
          btnObj.reqForAll = true;
        }
        if (corridore.lock)
        {
          btnObj.lock = true;
        }
        if (corridore.hide)
        {
          btnObj.hide = true;
        }

        btnsObj.push(btnObj);
      });

      if (this.hasExit)
      {
        btnsObj.push("leave");
      }
    }
    else
    {
      jsonObj.loot = false;
      jsonObj.nextId = this.nextId;
      jsonObj.size = this.size;
      jsonObj.lootTable = this.lootTable;
    }

    return jsonObj;
  }
}