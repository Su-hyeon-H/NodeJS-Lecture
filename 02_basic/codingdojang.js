function solution(n) {
    var input = n;

    var numStr = '';
    var engStr = '';


    for (var i = 0; i < input.length; i++) {
        var _char = input[i].charCodeAt();

        if (_char > 47 && _char < 58) { // 숫자 구분
            numStr += input[i];
        } else if ((_char > 64 && _char < 91) || _char > 96 && _char < 123) { // 영문구분
            engStr += input[i];
        }
    }

    console.log(numStr);
    console.log(engStr);
}

solution('c910m6ia');