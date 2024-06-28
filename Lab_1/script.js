function addN()
{
    const DivNumbers = document.querySelector("#numbers");
    const count = DivNumbers.getElementsByTagName("input").length;

    var input = document.createElement("input");
    input.setAttribute("type", "number");
    input.setAttribute("id", "n"+(count+1));
    DivNumbers.appendChild(input); 

    checkN(count+1);
}

function delN()
{
    const DivNumbers = document.querySelector("#numbers");
    const count = DivNumbers.getElementsByTagName("input").length;

    var input = document.querySelector("#n"+count);
    DivNumbers.removeChild(input); 

    checkN(count-1);

    sum();
}

function checkN(count)
{

    if (count <= 1)
        document.querySelector("#butDel").style.display = "none";
    else
        document.querySelector("#butDel").style.display = "block";
}

function sum()
{
    const DivNumbers = document.querySelector("#numbers");
    const count = DivNumbers.getElementsByTagName("input").length-1;

    numbers = [];

    resultSum = 0;
    resultAvg = 0;

    for (i = 0; i <= count; i++)
    {
        numbers[i] = Number(document.querySelector("#n"+(i+1)).value);
        
        resultSum += numbers[i];
        resultAvg = resultSum / (i+1);
    }

    resultMin = Math.min(...numbers);
    resultMax = Math.max(...numbers);

    document.querySelector("#resultSum").innerHTML = resultSum;
    document.querySelector("#resultAvg").innerHTML = resultAvg;
    document.querySelector("#resultMin").innerHTML = resultMin;
    document.querySelector("#resultMax").innerHTML = resultMax;
}

function autoSum() {
    document.addEventListener('keyup', function(event) {
        sum();
    });
}