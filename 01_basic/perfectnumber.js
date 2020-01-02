function perfect(n){
    var a = 0;
    for (var i=1; i<=n/2; i++)
    {
        if (n % i === 0)
        {
            a  += i;
        }
    }
    if (a === n && a !==0)
    {
        console.log ("ㅇㅇ");
    }
    else
    {
        console.log ("ㄴㄴ");
    }
}
for (var n=0; 0<n<10000; n++)
{
perfect(10100);
return 0;
}
