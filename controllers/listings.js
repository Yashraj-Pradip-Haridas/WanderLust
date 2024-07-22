const Listing = require("../models/listing.js");


module.exports.index  = async(req,res)=>{
    const allListings = await Listing.find({}); 
    res.render("./listings/index.ejs", {allListings});
}

module.exports.renderNewForm =  (req,res)=>{
    // console.log(req.user);
    res.render("./listings/new.ejs");
}

module.exports.showListing = async (req,res)=>{
    const {id} = req.params;
    const listing =  await Listing.findById(id).populate({path : "reviews", populate : {path : "author"}}).populate("owner"); 
    //This include the nesting of the populate keyword for accessing a file inside a file that is populated
    //This will save the object instead of the ids for the reviews
    if(!listing){
        req.flash("error", "Listing does not exist");
        res.redirect("/listings");
    }
    // console.log(listing);
    res.render("./listings/show.ejs", {listing});
}

module.exports.createListing = async (req,res)=>{
    let url = req.file.path;
    let filename =  req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    await newListing.save();
    req.flash("success", "New listing created!!");
    res.redirect("/listings");
}

module.exports.renderEditForm = async (req,res)=>{
    const {id} = req.params;
    const listing =  await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing does not exist");
        res.redirect("/listings");
    }
    res.render("./listings/edit.ejs", {listing});
}


module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    console.log(req.body.listing);
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});  //This deconstructs all the data from the body and passes to database
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename =  req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    req.flash("success", "Updated Successfully!!");
    res.redirect(`/listings/${id}`);
}


module.exports.destroyListings = async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!!");
    res.redirect("/listings");
}