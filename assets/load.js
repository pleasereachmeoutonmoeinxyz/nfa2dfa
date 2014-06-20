$(document).ready(function(){
    $("input[name=states]").tagsInput({'width':'auto','height':50,'defaultText':'State'});
    $("input[name=symbols]").tagsInput({'width':'auto','height':50,'defaultText':'Symbol'});

    $("input#generate").on('click',function(){
        var symbols =   $("input[name=symbols]").val().split(","),
            states  =   $("input[name=states]").val().split(",");
        
        if (symbols.indexOf('Landa') > -1) {
            symbols.splice(symbols.indexOf('Landa'),1);
        }
        generateTable(symbols,states)
    });
    
    function generateTable(symbols,states){
        var html    =   '<table class="table">';
        html    +=  '<thead><tr><th>States/Symbols</th><th>Start</td><th>Finals</th><th>Landa</th>'
        symbols.forEach(function(symbol){
            html    +=  '<th>' + symbol + '</th>';
        });
        html    +=  '</tr></thead>';
        states.forEach(function(state){
           html     +=  '<tr><td>' + state + '</td><td><input type="radio" name="start" value="' + state + '"></td><td><input type="checkbox" name="finals[]" value="'+ state + '"></td><td><select name="' + state +'_Landa" multiple><option value="" style="display:none;"></option>';
           states.forEach(function(s){
               if (s != state){
                   html   +=  '<option value="' + s + '">' + s + '</option>' ;
               }
           });
           html  +=  '</select></td>';
            symbols.forEach(function(symbol){
              html  +=  '<td><select name="' + state+'_'+symbol+'" multiple><option value="" style="display:none;"></option>';
              states.forEach(function(s){
                 html   +=  '<option value="' + s + '">' + s + '</option>' ;
              });
              html  +=  '</select></td>';
           });
           html +=  '</tr>';
        });
        html    +=  '</table>';
        html    +=  '<div class="form-group">';
        html    +=  '<div class="col-sm-9 col-sm-offset-3 col-lg-10 col-lg-offset-2">';
        html    +=  '<input type="button" class="btn btn-block btn-success" value="Convert to DFA" onclick="convert();"></div></div>';
        $("#table").html(html);
    }
    
});

    
function convert(){
    var symbols =   $("input[name=symbols]").val().split(","),
        states  =   $("input[name=states]").val().split(",");
    
    if (symbols.indexOf('Landa') == -1) symbols.push('Landa');
    
    var def =   {
        'start':states[0],
        'finals':states[states.length - 1],
        'states':states,
        'symbols':symbols,
        'table':{}
    };
    
    if ($("input[name=start]").val() != "")
        def['start']    =   $("input[name=start]").val();

    states.forEach(function(state){
        def['table'][state] =   [];
        symbols.forEach(function(symbol){
            def['table'][state][symbol] = [];
            $("select[name="+state+"_"+symbol+"] :selected").each(function (){
                if ($(this).val() != "")
                    def['table'][state][symbol].push($(this).val());
            });
        });
    });
    
    var converttor  =   new Machin(def),
        result      =   converttor.getDFA(),
        html        =   '<table class="table">',
        states      =   [];
        
    html    +=  '<thead><tr><th>States/Symbols</th>';
    
    $.each(result,function(index,value){
        states.push(index);
    });
    
    symbols.forEach(function(symbol){
        if (symbol != 'Landa') html    +=  '<th>' + symbol + '</th>';
    });
    html   +=   '</tr></thead>';
    
    
    $.each(result,function(index,value){
        html    +=  "<tr><td>" + String.fromCharCode(65 + states.indexOf(index)) + "</td>";
        $.each(value,function (index2,value2){
           html +=  '<td>' + String.fromCharCode(65 + states.indexOf(value2)) + '</td>'; 
        });
        html    +=  '</tr>'
    });
    html    +=  "</table>";
    $("#table_result").html(html);
}

