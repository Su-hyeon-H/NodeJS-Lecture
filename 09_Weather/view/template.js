module.exports={
   
    List: function(filelist){
            var list ='<ul>\n';
            for(let file of filelist){
                let item =file.substring(0,file.length-4)
                list +=`<li><a href="/?title=${item}">${item}</a></li>\n`;
             }
        list +='</ul>';
        return list;
    },
    navMain:function(result){
        return`
            <a href="/">홈으로</a>&nbsp;&nbsp;
            <a href="/create">글쓰기</a> &emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;
            <td>도시명: ${result.name} 기온: ${result.main.temp} &deg; 체감온도: ${result.main.feels_like} &deg;</td>
            <td><img src ="http://openweathermap.org/img/w/${result.weather[0].icon}.png" height="50" width="50"></td>`;
    },
    navList: function(id){
        return `   
            <a href="/">홈으로</a>&nbsp;&nbsp;
            <a href="/update/${id}">수정하기</a>&nbsp;&nbsp; 
            <a href="/delete/${id}">삭제하기</a>`;
    },
    navOp:function(){
        return `<a href="/">홈으로</a>`;
    },
    tableItem: function(row){
        let _content = row.content.replace(/\r\n/g,'<br>');

        return `
        <tr><td>ID</td><td>${row.id}</td></tr>
        <tr><td>제목</td><td>${row.title}</td></tr>
        <tr><td>글쓴이</td><td>${row.userId}</td></tr>
        <tr><td>최종 수정 시간</td><td>${row.ts}</td></tr>
        <tr><td>조회수</td><td>${row.hit}</td></tr>
        <tr><td>내용</td><td>${_content}</td></tr>`;

    },
    tableMain: function(row){
        return `<tr>
        <td>${row.id}</td>
        <td style="text-align: left;"><a href="/id/${row.id}">${row.title}</a></td>
        <td>${row.userId}</td>
        <td>${row.ts}</td>
        <td style="text-align: right;">${row.hit}</td>
        </tr>`;
    }
}