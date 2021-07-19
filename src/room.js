class Room
{
  constructor(fields = null)
  {

    // Default
    this.id = "new-room" + Math.random().toString().slice(2, 6);
    this.title = "";
    this.body = "";
    this.visitedBody = "clone";
    this.corridors = [];
    this.hasExit = false;
    this.type = 0;
    
    // Lootable
    this.nextId = "leave";
    this.size = 10;
    this.lootTable = [];

    this.bodyRendered = "";

    // From Fields
    if (fields !== null)
    {
      this.id = fields.id;
      this.title = fields.title;
      this.body = fields.body;
      this.visitedBody = "clone";
      this.corridors = [];
      this.type = fields.loot ? 1 : 0;

      if (this.type === 0)
      {
        fields.btns.forEach((corridor) => {
          if (corridor === "leave")
          {
            this.hasExit = true;
            return;
          }

          this.corridors.push({
            for: corridor.for,
            text: corridor.text,
            req: corridor.req || false,
            reqItems: corridor.reqItems || [],
            reqConsume: corridor.reqConsume || false,
            hide: corridor.hide || false,
            reqForAll: corridor.reqForAll || false
          });
        });
      }
      else
      {
        this.nextId = fields.nextId;
        this.size = fields.size;
        fields.lootTable.forEach((loot) => {
          this.lootTable.push(loot);
        });
      }
    }
  }

  setId(id)
  {
    this.id = id.replace(" ", "-");
  }

  addcorridor(roomId, text)
  {
    if (this.type === 1)
    {
      if (this.nextId)
      {
        alert(this.id + ": a loot room can only have 1 corridor.");
        return;
      }

      this.nextId = roomId;
    }
    else
    {
      let corridor = null;
      corridor = { for: roomId, text, req: false, reqItems: [], reqConsume: false, hide: false, reqForAll: false };

      this.corridors.push(corridor);
    }
  }

  removecorridor(roomId)
  {
    const corridorIndex = this.corridors.findIndex((corridor) => {
      corridor.for === roomId;
    });
    this.corridors.splice(corridorIndex, 1);
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

  render()
  {
    if (this.body.length === 0) {
      this.bodyRendered = "Empty";
      return;
    };

    const regex = /```([\s\S]*?)```/g;
    this.bodyRendered = currentRoom.body.length === 0 ? "Empty" : currentRoom.body.replace(regex,
    "<span class=\"doc\">$1</span>").replace(/[\n*]/g, " ");
  }

  generateJSON()
  {
    this.render();
    const jsonObj = {};
    jsonObj.id = this.id;
    jsonObj.title = this.title;
    jsonObj.body = this.bodyRendered;
    if (this.visitedBody !== "clone") jsonObj.visitedBody = this.visitedBody;

    if (this.type === 0)
    {
      const btnsObj = [];
      this.corridors.forEach((corridor) => {
        const btnObj = {};
        btnObj.for = corridor.for;
        btnObj.text = corridor.text;
        if (corridor.req)
        {
          btnObj.req = corridor.req;
          btnObj.reqItems = corridor.reqItems;
          if (corridor.reqConsume) btnObj.reqConsume = corridor.reqConsume;
          if (corridor.reqForAll) btnObj.reqForAll = corridor.reqForAll;
        }
        if (corridor.lock)
        {
          btnObj.lock = true;
        }
        if (corridor.hide)
        {
          btnObj.hide = true;
        }

        btnsObj.push(btnObj);
      });

      if (this.hasExit)
      {
        btnsObj.push("leave");
      }
      jsonObj.btns = btnsObj;
    }
    else
    {
      jsonObj.loot = true;
      jsonObj.nextId = this.nextId;
      jsonObj.size = this.size;
      jsonObj.lootTable = this.lootTable;
    }

    return jsonObj;
  }
}