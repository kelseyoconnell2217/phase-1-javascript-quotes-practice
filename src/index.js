

addEventListener('DOMContentLoaded', fetchQuotes)  
const quoteList = document.getElementById('quote-list')
let newQuoteField = document.getElementById('new-quote')
let newAuthorField = document.getElementById('author')





function fetchQuotes(){
    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(resp=>resp.json())
    .then(jsonResponse => {console.log(jsonResponse);
    jsonResponse.forEach(element => renderQuote(element))})
}

function renderQuote(quote){
    let card = document.createElement('li')
    card.className = "quote-card"
        let block = document.createElement('blockquote')
        block.className = "blockquote"
        block.id = quote.id
        card.appendChild(block)
        let p = document.createElement('p')
            p.className="mb-0"
            p.innerText=`"` + quote.quote + `"`
            block.appendChild(p)
        let footer= document.createElement('footer')
            footer.className ="blockquote-footer"
            footer.innerText = quote.author
            block.appendChild(footer)
        let br = document.createElement('br')
            block.appendChild(br)
        let btn1 = document.createElement('button')
            btn1.className = 'btn-success'
            btn1.innerText= 'Likes: '
            btn1.addEventListener('click', e => likeQuote(e))
            let span = document.createElement('span')
            span.innerText= quote.likes.length
            btn1.appendChild(span)
            block.appendChild(btn1)
        let btn2 = document.createElement('button')
            btn2.className = 'btn-danger'
            btn2.innerText = 'Delete'
            block.appendChild(btn2)
            btn2.addEventListener('click', e=>deleteQuote(e))
    quoteList.appendChild(card)
}


const form = document.getElementById('new-quote-form')
form.addEventListener('submit', (e)=> addNewQuote(e))
let jsonResponse
let lastId


function addNewQuote(e){
    e.preventDefault();
    fetch('http://localhost:3000/quotes')
    .then(resp=>resp.json())
    .then(jsonResponse => {
        lastId = jsonResponse[jsonResponse.length-1]["id"]
        }
    )
    .then(()=>{fetch('http://localhost:3000/quotes', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            "id": parseInt(lastId) + 1,
            "quote": newQuoteField.value,
            "author": newAuthorField.value
        })
    })})
    .then(()=>fetch("http://localhost:3000/quotes?_embed=likes")
        .then(resp=>resp.json())
        .then(jsonResponse => {
            quoteList.innerHTML="";
            jsonResponse.forEach(element => renderQuote(element));
            newQuoteField.value = "";
            newAuthorField.value = ""
        })
    )
}
    
function deleteQuote(e){
   let quoteToDelete= e.target.parentNode.id
   fetch(`http://localhost:3000/quotes/${quoteToDelete}`, {
        method: 'DELETE',
        headers: {'Content-Type':'application/json'}
   })
   .then(resp=>{
        if(resp.ok){
           e.target.parentNode.parentNode.remove();
        }else{console.log('delete error' + resp)}
        })
    .then(()=>fetch(`http://localhost:3000/quotes/${quoteToDelete}/likes`, {
            method: 'DELETE',
            headers: {'Content-Type':'application/json'}}))
    .then(resp=>
        {if(resp.ok){console.log('Likes Deleted')}
            else if(resp.code = 404){console.log('No likes to delete')}
            else{console.log('ERROR')}   
        }
    )
   
}

function likeQuote(e){
    let quoteToLike = e.target.parentNode.id;
    let lastLike
    let lastLikeId
    fetch(`http://localhost:3000/likes`)
        .then(resp=>resp.json())
        .then(resp => {
            lastLike = parseInt(resp.length-1);
            lastLikeId =lastLike.id;
        })
    .then(()=>{
        fetch(`http://localhost:3000/likes`, {
            method: "POST",
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({
                "id": parseInt(lastLikeId+1),
                'quoteId' : parseInt(quoteToLike),
                "createdAt" : Math.floor((new Date()).getTime() / 1000)
            })
        })
        .then(()=>fetch("http://localhost:3000/quotes?_embed=likes")
        .then(resp=>resp.json())
        .then(jsonResponse => {
            quoteList.innerHTML="";
            jsonResponse.forEach(element => renderQuote(element));
        })
    )
    })   
    

}

    //   console.log(currentLikes)




//     fetch(`http://localhost:3000/quotes/`, {
//         method: 'POST',
//         headers: {'Content-Type':'application/json'},
//         body: {
//             id: ,
//             quoteid: e.id,

//         }
//     })
// }