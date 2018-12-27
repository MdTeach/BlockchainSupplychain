const sha256 = require('js-sha256');
const Url = require('url-parse');
const rp = require('request-promise');
const request = require('async-request'); 

class BlockChain{
    constructor(){
        this.chain = [];
        this.transcations = [];
        this.createBlock(1,'0');
        this.nodes = [
            "http://localhost/getChain",
            "http://localhost/getChain",
            "http://localhost/getChain"
        ];
    }

    //Create a new block
    createBlock(proof, previousHash) {
        let block = {
            index: this.chain.length+1,
            'timestamp': Date.now(),
            'proof':proof,
            'previousHash':previousHash,
            'transcations':this.transcations
        }
        this.transcations = {};
        this.chain.push(block);
        return block;
    }

    getPreviousBlock(){
        return this.chain[this.chain.length-1];
    }

    proofOfWork(previousProof){
        let newProof = 1;
        let checkProof = false;
        while(checkProof == false){
            let hashOperation = sha256((newProof**2-previousProof**2).toString());
            if(hashOperation.substring(0,4) == "0000"){
                checkProof = true;
            }else{
                newProof++;
            }
        }
        return newProof;
        
    }

    hash(block){
        return sha256(JSON.stringify(block));
    }

    isChainValid(chain){
        let previousBlock = chain[0];
        let blockIndex = 1;
        while(blockIndex < chain.length){
            let block = chain[blockIndex];
            if(block["previousHash"] != this.hash(previousBlock)){
                return false;
            }
            let previousProof = previousBlock['proof'];
            let proof = block['proof'];
            let hashOperation = sha256((proof**2-previousProof**2).toString());
            if(hashOperation.substring(0,4) != "0000"){
                return false;
            }
            previousBlock = block;
            blockIndex+=1;
        }
        return true;
    }

    addTranscation(data){
        this.transcations = data
    }

    addNode(address){
        let url = Url(address);
        this.nodes.add(url.hostname);
    }

    async replaceChain(){
        let netwok = this.nodes;
        let maxLength = this.chain.length;
        let longestChain = null;

        for(let i=0;i<netwok.length;i++){
            let response;
            try{
                response = await request(netwok[i]);
                if(response.statusCode == 200){
                    let responseBody =  JSON.parse(response.body);
                    let length = responseBody.length;
                    let chain = responseBody.chain;
                    if(length>maxLength && this.isChainValid(chain)){
                        longestChain = chain;
                        maxLength = length;
                    }
                }
            }catch(e){
                console.log(e);
            }

            if(longestChain){
                this.chain = longestChain;
                console.log("Chain was replaced")
            }else{
                console.log("Current chain is the longest one")
            }
        }
    }
}
module.exports = BlockChain;