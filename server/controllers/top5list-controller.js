const Top5List = require('../models/top5list-model');

createTop5List = (req, res) => {
    const body = req.body;
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a Top 5 List',
        })
    }

    const top5List = new Top5List(body);
    console.log("creating top5List: " + JSON.stringify(top5List));
    if (!top5List) {
        return res.status(400).json({ success: false, error: err })
    }

    top5List
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                top5List: top5List,
                message: 'Top 5 List Created!'
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'Top 5 List Not Created!'
            })
        })
}

userUpdateTop5List = async (req, res) => {
    const body = req.body
    console.log("updateTop5List: " + JSON.stringify(body));
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Top5List.findOne({ _id: req.params.id }, (err, top5List) => {
        console.log("top5List found: " + JSON.stringify(top5List));
        if (err) {
            return res.status(404).json({
                err,
                message: 'Top 5 List not found!',
            })
        }

        if(top5List.userName !== req.params.user){
            return res.status(401).json({ err, 
                message: 'User does not have ownership of the Top 5 List!'
            }); 
        }

        if(top5List.published){
            return res.status(401).json({ err, 
                message: 'Top5List has already been published!'
            });
        }

        top5List.name = body.name
        top5List.items = body.items
        top5List
            .save()
            .then(() => {
                console.log("SUCCESS!!!");
                return res.status(200).json({
                    success: true,
                    id: top5List._id,
                    message: 'Top 5 List updated!',
                })
            })
            .catch(error => {
                console.log("FAILURE: " + JSON.stringify(error));
                return res.status(404).json({
                    error,
                    message: 'Top 5 List not updated!',
                })
            })
    })
}

updateTop5List = async (req, res) => {
    const body = req.body
    console.log("updateTop5List: " + JSON.stringify(body));
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Top5List.findOne({ _id: req.params.id }, (err, top5List) => {
        console.log("top5List found: " + JSON.stringify(top5List));
        if (err) {
            return res.status(404).json({
                err,
                message: 'Top 5 List not found!',
            })
        }

        if(!top5List.published){
            return res.status(401).json({ err, 
                message: 'Top5List has not been published yet!! You may not view, like , dislike, or comment!!'
            });
        }

        top5List.likes = body.likes
        top5List.dislikes = body.dislikes
        top5List.comments = body.comments
        top5List.views = body.views

        top5List
            .save()
            .then(() => {
                console.log("SUCCESS!!!");
                return res.status(200).json({
                    success: true,
                    id: top5List._id,
                    message: 'Top 5 List updated!',
                })
            })
            .catch(error => {
                console.log("FAILURE: " + JSON.stringify(error));
                return res.status(404).json({
                    error,
                    message: 'Top 5 List not updated!',
                })
            })
    })
}


deleteTop5List = async (req, res) => {
    Top5List.findById({ _id: req.params.id }, (err, top5List) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'Top 5 List not found!',
            })
        }
        if(top5List.userName !== req.params.user){
            return res.status(401).json({ err, 
                message: 'User does not have ownership of the Top 5 List!'
            }); 
        }
        
        Top5List.findByIdAndDelete(req.params.id, (err, top5list) => {
            if(top5list.published){ 
                updateCommunityLists(top5list.name);
            }
            return res.status(200).json({ success: true, data: top5list });
        }).catch(err => console.log(err));
    });
}

getTop5ListById = async (req, res) => {
    await Top5List.findById({ _id: req.params.id }, (err, list) => {
        if (err) {
            return res.status(400).json({ success: false, error: err });
        }
        
        return res.status(200).json({ success: true, top5List: list })
    }).catch(err => console.log(err))
}

getTop5Lists = async (req, res) => {
    if(req.query.name){
        await Top5List.find({name: req.query.name, published: true}, (err, top5Lists) => {
            if (err) {
                return res.status(400).json({ success: false, error: err })
            }
            if (!top5Lists) {
                console.log("!top5Lists.length");
                return res
                    .status(404)
                    .json({ success: false, error: 'Top 5 Lists not found' })
            }
            else {
                // PUT ALL THE LISTS INTO ID, NAME PAIRS
                let listData = [];
                for (let key in top5Lists) {
                    let list = top5Lists[key];
                    if(list.userName === "Community"){
                        continue; 
                    }
                    let date = list.publishDate.toDateString();
                    let len = date.length;
                    date = date.substring(4, len-5) + "," + date.substring(len-5);
                    let data = {
                        _id: list._id,
                        name: list.name,
                        userName: list.userName,
                        views: list.views,
                        likes: list.likes,
                        dislikes: list.dislikes,
                        publishDate: date,
                        items: list.items,
                        comments: list.comments
                    };
                    listData.push(data);   
                }
                return res.status(200).json({ success: true, top5lists: listData })
            }
        }).catch(err => console.log(err)); 
    }
    else if(req.query.user){
        await Top5List.find({userName: req.query.user, published: true}, (err, top5Lists) => {
            if (err) {
                return res.status(400).json({ success: false, error: err })
            }
            if (!top5Lists) {
                console.log("!top5Lists.length");
                return res
                    .status(404)
                    .json({ success: false, error: 'Top 5 Lists not found' })
            }
            else {
                // PUT ALL THE LISTS INTO ID, NAME PAIRS
                let listData = [];
                for (let key in top5Lists) {
                    let list = top5Lists[key];
                    if(list.userName === "Community"){
                        continue; 
                    }
                    let date = list.publishDate.toDateString();
                    let len = date.length;
                    date = date.substring(4, len-5) + "," + date.substring(len-5);
                    let data = {
                        _id: list._id,
                        name: list.name,
                        userName: list.userName,
                        views: list.views,
                        likes: list.likes,
                        dislikes: list.dislikes,
                        publishDate: date,
                        items: list.items,
                        comments: list.comments
                    };
                    listData.push(data);   
                }
                return res.status(200).json({ success: true, top5lists: listData })
            }
        }).catch(err => console.log(err)); 
    }
    else{
        return res.status(200).json({ success: true, top5lists: [] });
    }
}

getUserTop5Lists = async (req, res) => {
    const {user, name} = req.query;
    await Top5List.find({userName: user}, (err, top5Lists) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!top5Lists) {
            console.log("!top5Lists.length");
            return res
                .status(404)
                .json({ success: false, error: 'Top 5 Lists not found' })
        }
        else {
            // PUT ALL THE LISTS INTO ID, NAME PAIRS
            let listData = [];
            if(user === "Community"){
                for (let key in top5Lists) {
                    let list = top5Lists[key]; 
                    if(list.name.startsWith(name) && name){
                        let date = list.publishDate.toDateString();
                        let len = date.length;
                        date = date.substring(4, len-5) + "," + date.substring(len-5);
                        let data = {
                            _id: list._id,
                            name: list.name,
                            views: list.views,
                            likes: list.likes,
                            dislikes: list.dislikes,
                            publishDate: date,
                            items: list.items,
                            comments: list.comments,
                            votes: list.votes
                        };
                        listData.push(data);
                    }
                }
            }
            else{
                for (let key in top5Lists) {
                    let list = top5Lists[key];
                    if(list.name.startsWith(name)||!name){
                        let date = null
                        if (list.published){
                            date = list.publishDate.toDateString();
                            let len = date.length;
                            date = date.substring(4, len-5) + "," + date.substring(len-5); 
                        }
                        let data = {
                            _id: list._id,
                            name: list.name,
                            userName: list.userName,
                            views: list.views,
                            likes: list.likes,
                            dislikes: list.dislikes,
                            publishDate: date,
                            published: list.published,
                            items: list.items,
                            comments: list.comments
                        };
                        listData.push(data);
                    }
                }
            }
            return res.status(200).json({ success: true, top5lists: listData })
        }
    }).catch(err => console.log(err));
}

publishTop5List = async (req, res) => {
    const body = req.body
    console.log("updateTop5List: " + JSON.stringify(body));
    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }

    Top5List.findOne({ _id: req.params.id }, (err, top5List) => {
        console.log("top5List found: " + JSON.stringify(top5List));
        if (err) {
            return res.status(404).json({
                err,
                message: 'Top 5 List not found!',
            })
        }

        if(top5List.userName !== req.params.user){
            return res.status(401).json({ err, 
                message: 'User does not have ownership of the Top 5 List!'
            }); 
        }

        top5List.name = body.name
        top5List.items = body.items
        top5List.publishDate = new Date();
        top5List.published = true; 

        top5List
            .save()
            .then(() => {
                console.log("SUCCESS!!!");
                updateCommunityLists(body.name);
                return res.status(200).json({
                    success: true,
                    id: top5List._id,
                    message: 'Top 5 List updated!',
                })
            })
            .catch(error => {
                console.log("FAILURE: " + JSON.stringify(error));
                return res.status(404).json({
                    error,
                    message: 'Top 5 List not updated!',
                })
            })
    })
}

async function updateCommunityLists(name){
    await Top5List.find({name: name, published: true}, (err, top5Lists) => {
        if (err) {
            return res.status(404).json({ success: false, error: err });
        }
        
        if (!top5Lists){
            return;
        }
        if(top5Lists.length === 1 && top5Lists[0].userName === "Community"){
            Top5List.findOneAndDelete({ _id: top5Lists[0]._id }, (err, top5list) => {
                return;
            }).catch(err => console.log(err))
            return; 
        }
        let itemVotePairs = {}; 
        let communityList = null;
        for (let key in top5Lists) {
            let list = top5Lists[key];
            if(list.userName === "Community"){
                communityList = list
                continue; 
            }
            list.items.forEach((item, index) => {
                if(!itemVotePairs[item]){
                    itemVotePairs[item] = 5-index;
                }
                else{
                    itemVotePairs[item] += 5-index;
                }
            });
        }
        let pairs = Object.entries(itemVotePairs);
        let items = []
        let votes = [] 
        items.push(pairs[0][0])
        votes.push(pairs[0][1])
        pairs.shift(); 
        for (let key in pairs){
            pair = pairs[key]
            if(pair[1] < votes[votes.length-1]){
                votes.push(pair[1]);
                items.push(pair[0]);
            }
            else{
                for (let i = 0; i < votes.length; i++){
                    if(pair[1] >= votes[i]){
                        if(i === 0){
                            votes.unshift(pair[1]);
                            items.unshift(pair[0]);
                            break;
                        }
                        else{
                            votes.splice(i, 0, pair[1]); 
                            items.splice(i, 0, pair[0]);
                            break; 
                        }
                    }
                }
            }
            if(votes.length > 5){
                votes.pop();
                items.pop();
            }
        }
        
        if(communityList){
            communityList.items = items;
            communityList.votes = votes; 
            communityList.save();  
        } else {
            const top5List = new Top5List({name: name, items: items, userName: "Community", views: [],
            likes:[], dislikes:[], comments:[], publishDate: new Date(), published: true, votes: votes}); 
            top5List.save(); 
        }
    }).catch(err => console.log(err));
}

module.exports = {
    createTop5List,
    userUpdateTop5List,
    updateTop5List,
    deleteTop5List,
    getTop5Lists,
    getUserTop5Lists,
    getTop5ListById,
    publishTop5List
}