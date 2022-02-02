const OffersController = require("../models/offers");
const Offer = require("../models/offers");

const getOffers = async (req, res) => {
  try {
    let offers = [];
    if (Object.keys(req.query).length === 2 && !req.query.search) {  //Only price
      const offers = await Offer.find({
        price: {
          $gte: req.query.catminPrice,
          $lte: req.query.catmaxPrice
        }
      });
      if (offers.length > 0){
        res.status(200).json({message: "offers received", offers: offers});
      } else {
        res.status(403).json({message: "Товар отсутствует"});
      }
    } else if (Object.keys(req.query).length >= 3 && !req.query.search) { //price + category
      let category = [];
      const minPrice = req.query.catminPrice;
      const maxPrice = req.query.catmaxPrice;
      for (const reqKey in req.query) {
        if (req.query[reqKey] !== minPrice && req.query[reqKey] !== maxPrice) {
          category.push(req.query[reqKey]);
        }
      }
      for (const item of category) {
        let offer = await OffersController.find({
          category: {$in: `${item}`},
          price: {
            $gte: req.query.catminPrice,
            $lte: req.query.catmaxPrice
          }
        });
        for (const item of offer) {
          offers.push(item);
        }
      }
      if (offers.length > 0){
        res.status(200).json({message: "offers received", offers: offers});
      } else {
        res.status(403).json({message: "Товар отсутствует"});
      }
    } else if (req.query.search) { // only search
      offers = await Offer.find({name: {$regex: req.query.search, $options: 'i'}});
      if (offers.length > 0){
        res.status(200).json({message: "offers received", offers: offers});
      } else {
        res.status(403).json({message: "Товар отсутствует"});
      }
    } else { // without filter
      const offers = await OffersController.find();
      res.status(200).json({message: "offers received", offers: offers});
    }
  } catch (error) {
    res.status(500).json({message: "error", error: error});
  }
}

const getOfferDetails = async (req, res) => {
  try {
    const offerDetails = await OffersController.find({_id: req.params.id});
    res.status(200).json(offerDetails[0]);
  } catch (error) {
    res.status(500).json({message: "error", error: error})
  }
}
const getOfferById = async (req, res) => {
  try {
    const offer = await Offer.find({partNumber: req.params.id});
    if (offer?.length) {
      res.status(200).json(offer[0]);
    } else {
      res.status(404).json({message: "Offer not found"});
    }
  } catch (error) {
    res.status(500).json({message: "Internal server error", error: error});
  }
};

const addProduct = async (req, res) => {
  try {
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    const offer = new Offer({
      description: req.body.description,
      designer: req.body.designer,
      price: req.body.price,
      category: req.body.category,
      name: req.body.name,
      availability: req.body.availability,
      partNumber: req.body.partNumber,
      img: imageUrl,
    });
    await offer.save();
    res.status(201).json({message: "Offer added successfully!"})
  } catch (error) {
    res.status(500).json({message: "Internal server error", error: error});
  }
};

const deleteProduct = async (req, res) => {
  try {
    const {id} = req.params;
    await Offer.remove({partNumber: id});
    res.status(200).json({message: "Product deleted successfully!"})
  } catch (error) {
    res.status(500).json({message: "Internal server error", error: error});
  }
};

const editProduct = async (req, res) => {
  try {
    const {id} = req.params;
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    await Offer.findOneAndUpdate(
      {partNumber: id},
      {
        $set: {
          description: req.body.description,
          designer: req.body.designer,
          price: req.body.price,
          category: req.body.category,
          name: req.body.name,
          availability: req.body.availability,
          img: imageUrl,
        }
      },
    )
    res.status(200).json({message: "Product been edit!"});
  } catch (error) {
    res.status(500).json({message: "Internal server error", error: error});
  }
};

module.exports = {getOffers, addProduct, deleteProduct, getOfferById, editProduct, getOfferDetails}
