import items from '../models/item-model.js';

// Hakee kaikki itemit listasta
const getItems = (req, res) => {
  // palautetaan kaikki items-taulukon objektit JSON-muodossa
  res.json(items);
};

// Hakee yksittäisen itemin ID:n perusteella
const getItemById = (req, res) => {
  console.log('getting item id:', req.params.id);

  // etsitään item taulukosta jonka id vastaa URL-parametria
  const itemFound = items.find((item) => item.id == req.params.id);

  if (itemFound) {
    // jos item löytyy, palautetaan se JSONina
    res.json(itemFound);
  } else {
    // jos itemiä ei löydy, palautetaan 404 virhe
    res.status(404).json({message: 'item not found'});
  }
};

// Päivittää olemassa olevan itemin ID:n perusteella
const putItemById = (req, res) => {
  console.log('updating item id:', req.params.id);

  // etsitään itemin indeksi taulukosta
  const itemIndex = items.findIndex((item) => item.id == req.params.id);

  if (itemIndex !== -1) {
    // yhdistetään vanhat tiedot ja req.body:sta tulevat uudet tiedot
    items[itemIndex] = {...items[itemIndex], ...req.body};

    // palautetaan päivitetty item
    res.json({message: 'item updated', item: items[itemIndex]});
  } else {
    // jos itemiä ei löydy
    res.status(404).json({message: 'item not found'});
  }
};

// Poistaa itemin ID:n perusteella
const deleteItemById = (req, res) => {
  console.log('deleting item id:', req.params.id);

  // etsitään poistettavan itemin indeksi
  const itemIndex = items.findIndex((item) => item.id == req.params.id);

  if (itemIndex !== -1) {
    // poistetaan item taulukosta
    items.splice(itemIndex, 1);

    // palautetaan onnistumisviesti
    res.json({message: 'item deleted'});
  } else {
    // jos itemiä ei löydy
    res.status(404).json({message: 'item not found'});
  }
};

// Lisää uuden itemin listaan
const postNewItem = (req, res) => {
  //console.log('add item request body', req.body);

  // name on pakollinen kenttä uudelle itemille
  if (!req.body.name) {
    // jos nimi puuttuu, palautetaan 400 Bad Request
    return res.status(400).json({message: 'bad request'});
  }

  // luodaan uusi id itemille
  // jos listassa on jo itemeitä -> otetaan suurin id ja lisätään +1
  // jos lista on tyhjä -> id = 1
  const newId =
    items.length > 0 ? Math.max(...items.map((item) => item.id)) + 1 : 1;

  // luodaan uusi item objekti
  const newItem = {id: newId, ...req.body};

  // lisätään uusi item taulukkoon
  items.push(newItem);

  // palautetaan 201 Created ja lisätty item
  res.status(201).json({message: 'new item added', item: newItem});
};

// exportataan controller-funktiot routerin käyttöön
export {getItems, getItemById, putItemById, deleteItemById, postNewItem};