function isPalindrome(number){
    let str1 = String(number);
    let str2 =str1.split('').reverse().join('');
    return str1 === str2 ? true : false;
}

let maxPalin = 0;
let maxA = 0;
let maxB = 0;
for(let i= 100; i<= 999; i++){
    for (let k = i; k<= 999; k++){
        if(isPalindrome(i * k)){
           
        
    }
}
}