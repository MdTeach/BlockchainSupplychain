const express = require('express');
const sha256 = require('js-sha256');

const router = express.Router();

const BlockChain = require('../blockchain/BlockChain')
const blockChain = new BlockChain();

 
//Mine the block
router.get('/mine',(req,res)=>{
    blockChain.replaceChain();

    let previousBlock = blockChain.getPreviousBlock();
    let previousProof = previousBlock['proof'];
    let proof = blockChain.proofOfWork(previousProof);
    let previousHash = blockChain.hash(previousBlock);
    

    let block = blockChain.createBlock(proof,previousHash);
    let response = {
        message:'Congrats! transaction made sucessfully',
        index:block["index"],
        timestamp:block["timestamp"],
        proof:block["proof"],
        previousHash:block["previousHash"],
        transactions:block["transcations"]
    };
    return res.render("message",{message:response});

});

//Get the full blockchain
router.get('/getChain',(req,res)=>{
    
    response={
        chain:blockChain.chain,
        length:blockChain.chain.length
    };
    return res.send(response);
});

//Check if the current blockchain is valid
router.get('/isChainValid',(req,res)=>{
    let isValid = blockChain.isChainValid(blockChain.chain);
    let response;
    if(isValid){
        response = {message:"All blocks are valid"}        
    }else{
        response = {message:"Blocks are invalid"}
    }
    return res.send(response)
});

//Replcaing the chain by longest chain if needed
router.get('/replaceChain', (req,res)=>{
    return res.send(blockChain.replaceChain());
});

//* Routing from the gui */
router.get('/home',(req,res)=>{
    res.render("home");    
});

router.get('/search',(req,res)=>{
    if(req.query.hash){
        const hash = req.query.hash
        let block = null;
    
        let isProducer = false;
        let transactionsData = [];
    
        //Find the chain corresponding to the hash
        blockChain.chain.forEach((item)=>{
            if(sha256(JSON.stringify(item)) === hash){
                block = item;
            }
        });
        if(!block){
            //Not found
            return res.render("message",{message:{msg:"No product found"}});
        }else{
            //Found
            while(isProducer == false){
                let productHash = null;
                transactionsData.push(block.transactions);
                console.log(block);
                productHash = block.transcations.ProductHash;
                if(!productHash){
                    isProducer = true
                }else{
                    blockChain.chain.forEach((item)=>{
                        if(sha256(JSON.stringify(item)) === productHash){
                            block = item;
                            console.log("It was called")
                        }
                    });
                }
            }
            return res.render("message",{message:transactionsData});
        }
    }
    return res.render('search');
});

router.get('/vendor',(req,res)=>{
    return res.render('vendor');
});

router.get('/producer',(req,res)=>{
    return res.render('producer');
});

router.get('/chains',(req,res)=>{
    return res.render('blockchain')
});

//** Post requests from user gui */
router.post('/producer',(req,res)=>{
    const transactions = req.body;
    blockChain.addTranscation(transactions)
    return res.redirect('/mine');
});

router.post('/vendor',(req,res)=>{
    //Validate the request
    // product hash
    // receiver 
    // match the product hash and 
    const transactions = req.body;
    const productHash = transactions.ProductHash;
    const senderKey = transactions.VendorKey;

    //check if product hash and receiver
    if(!(productHash && senderKey)){
        return res.render('message',{message:{msg:"Bad input"}});
    }else{
        //check if product hash exists
        let block = null;
        blockChain.chain.forEach((item)=>{
            if(sha256(JSON.stringify(item)) === productHash){
                block = item;
            }
        });
        //check if producthash is valid 
        if(!block){
            return res.render('message',{message:{msg:"Product Hash doesnot exist"}});
        }else{
            //check that this block owned by vendor
            if(!(block.transcations.ReceiverKey === senderKey)){
                return res.render('message',{message:{msg:"You don't own the product"}});
            }else{
                //check if the block is already sold
                let isAlreadySold = false;
                blockChain.chain.forEach((item)=>{
                    let chainProductHash = null;
                    chainProductHash = item.transcations.ProductHash;
                    if(chainProductHash){
                        if(productHash === chainProductHash){
                            isAlreadySold = true;
                        }
                    }
                });
                if(isAlreadySold){
                    return res.render('message',{message:{msg:"You already sold this product"}});
                }else{
                    blockChain.addTranscation(transactions)
                    return res.redirect('/mine');
                }

            }
            
        }
    }

});

router.post('/search',(req,res)=>{
    const hash = req.body.hash
    let block = null;

    let isProducer = false;
    let transactionsData = [];

    //Find the chain corresponding to the hash
    blockChain.chain.forEach((item)=>{
        if(sha256(JSON.stringify(item)) === hash){
            block = item;
        }
    });
    if(!block){
        //Not found
        return res.render("message",{message:{msg:"No product found"}});
    }else{
        //Found
        while(isProducer == false){
            let productHash = null;
            transactionsData.push(block.transactions);
            console.log(block);
            productHash = block.transcations.ProductHash;
            if(!productHash){
                isProducer = true
            }else{
                blockChain.chain.forEach((item)=>{
                    if(sha256(JSON.stringify(item)) === productHash){
                        block = item;
                        console.log("It was called")
                    }
                });
            }
        }
        return res.render("message",{message:transactionsData});
    }
});

router.get('/test',(req,res)=>{
    res.render('genQr')
});


router.get('/scan',(req,res)=>{
    res.render('qr.html')
});
module.exports = router;