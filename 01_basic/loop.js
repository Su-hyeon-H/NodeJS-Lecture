/*
for (let i=0; i<5; i++){
    for(let g=0; g<=i; g++){
        process.stdout.write(' ');    
    } 
    for(let k=0; k<5-i; k++){
        process.stdout.write('*');
    }
    console.log();
}역삼각형
*/

for (let i=0; i<4; i++){
    for(let k=0; k<4-i; k++){
        process.stdout.write(' ');
    }
    for(let g=0; g<=2*i; g++){
        process.stdout.write('*');    
    } 
    console.log();
}

for (let i=0; i<3; i++){
    for(let k=0;k<=i+1; k++){
        process.stdout.write(' ');
    }
    for(let g=1; g<(3-i)*2; g++){
        process.stdout.write('*');
    }
    console.log();
}