const Items = (function()
{

const itemIds = [];

function loadDefaultItems()
{
  fetch("src/defaultItems.json")
  .then(data=>{return data.json()})
  .then(res=>{loadItemIds(res, true);});
}

loadDefaultItems();


function loadItemIds(json, isObject = false)
{
  try
  {
    let data = json;
    if (!isObject)
    {
      data = JSON.parse(json);
    }
    for (const key of Object.keys(data))
    {
      itemIds.push(key);
    }
  }
  catch(e)
  {
    alert("Event format is incorrect: (Check console)")
    console.log(e);
  }
}

function resetItemids()
{
  loadDefaultItems();
}

function clearItemIds()
{
  itemIds = [];
}

function getItemIds()
{
  return itemIds;
}

return Object.freeze({
  loadItemIds,
  clearItemIds,
  resetItemids,
  getItemIds,
});


})();