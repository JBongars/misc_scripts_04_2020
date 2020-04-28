
function throwError(){
  throw new Error('error!');
}

async function throwAsyncError(){
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // reject('error!');
      throw new Error('error!');
    }, 2000);
  })
}

 function test(){
  console.log('started!');
  // try {
    throwAsyncError();
  // } catch(err){
  //   console.error(err);
  // }
}

function doSomething(){
  setTimeout(() => {
    console.log('hit')  
  }, 5000);
}


// setInterval(() => console.log('ping!'), 500);

test();
doSomething();
