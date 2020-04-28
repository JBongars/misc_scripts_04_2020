
function doStep(start, end){
  let arr = ['a', 'b', 'c'];
  console.log(`${arr[start]} => ${arr[end]}`);
}

function calcPillars(n, start = 0, end = 2){
    if(n <= 1) return doStep(start, end);

    let middle = 3 - start - end;

    calcPillars(n - 1, start, middle);
    doStep(start, end);
    calcPillars(n - 1, middle, end)
}

calcPillars(4);
