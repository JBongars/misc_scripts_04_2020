
function test(){
  console.log('started');
  const err = new Error('hello');

  console.log(err);
  console.log(Error.toString());

  console.log('ended');
}



test();
