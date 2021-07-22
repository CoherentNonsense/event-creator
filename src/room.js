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
    this.hasVisited = false;
    this.visitTarget = "choose target..."
    
    // Lootable
    this.nextId = "leave";
    this.size = 10;
    this.lootTable = [];

    this.bodyRendered = "";
    this.visitedBodyRendered = "";

    // From Fields
    if (fields !== null)
    {
      this.id = fields.id;
      this.title = fields.title;
      this.body = fields.body.replace(/\s?<span class="doc">\s?([\s\S]*)\s?<\/span>\s?/g, "\n```\n$1\n```\n");
      if (fields.visitedBody && fields.visitedBody != "clone") 
      {
        this.hasVisited = true;
        this.visitTarget = fields.visitTarget;
        this.visitedBody = fields.visitedBody.replace(/\s?<span class="doc">\s?([\s\S]*)\s?<\/span>\s?/g, "\n```\n$1\n```\n");
      }
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
            reqForAll: corridor.reqForAll || false,
            reqTarget: corridor.reqTarget || "no target",
            lockTarget: corridor.lockTarget || "no target",
          });
        });
      }
      else
      {
        this.nextId = fields.nextId;
        if (this.nextId === "leave")
        {
          this.hasExit = true;
        }

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
    if (this.body.length === 0)
    {
      this.bodyRendered = "Empty";
    }

    if (this.body.length === 0)
    {
      this.visitedBodyRendered = "Empty";
    }

    const regex = /\s?```\s?([\s\S]*)\s?```\s?/g;
    this.bodyRendered = this.body.length === 0 ? "Empty" : this.body.replace(regex,
    "<span class=\"doc\">$1</span>").replace(/[\n*]/g, " ");

    this.visitedBodyRendered = this.body.length === 0 ? "Empty" : this.visitedBody.replace(regex,
      "<span class=\"doc\">$1</span>").replace(/[\n*]/g, " ");
  
  }

  generateJSON()
  {
    this.render();
    const jsonObj = {};
    jsonObj.id = this.id;
    jsonObj.title = this.title;
    jsonObj.body = this.bodyRendered;
    if (this.hasVisited)
    {
      jsonObj.visitedBody = this.visitedBodyRendered;
      jsonObj.visitTarget = (this.visitTarget && this.visitTarget !== "choose target...") ? this.visitTarget : this.id;
    }

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
          if (corridor.reqTarget && corridor.reqTarget !== "no target") btnObj.reqTarget = corridor.reqTarget;
          if (corridor.lockTarget && corridor.lockTarget !== "no target") { btnObj.lock = true; btnObj.lockTarget = corridor.lockTarget; }
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