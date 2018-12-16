var Node = function(list) {
  this.list = list;
  this.h = 0;
  this.g = 0;
  this.parent = null;
};

var move_dirx = [1, 0, -1, 0];
var move_diry = [0, 1, 0, -1];

$(document).ready(function() {
  var open = [];
  var closed = [];
  var steps = 0;
  var grids = $(".part");
  var init = [[2, 8, 3], [1, 6, 4], [7, 9, 5]];
  var final = [[1, 2, 3], [8, 9, 4], [7, 6, 5]];
  var all = 0;
  var choose_h1 = true; //TODO: add switch button
  var playing = false;
  var last = [[2, 8, 3], [1, 6, 4], [7, 9, 5]]; // last shuffle result
  initial();
  //aStar();

  function initial() {
    open = [];
    closed = [];
    steps = 0;
    all = 0;
    
    // TODO add shuffle(init) function later
    if(choose_h1) {
      init = shuffle();
      // copy init->last
      for(var i = 0; i < 3; i++) {
        for(var j = 0; j < 3; j++) {
          last[i][j] = init[i][j];
        }
      }
    }
    else {
      // copy last->init
      for(var i = 0; i < 3; i++) {
        for(var j = 0; j < 3; j++) {
          init[i][j] = last[i][j];
        }
      }
    }
    init_node = new Node(init);
    final_node = new Node(final);
    if(choose_h1)
      init_node.h = h1(init_node, final_node);
    else
      init_node.h = h2(init_node, final_node);      
    init_node.g = 0;
    open.push(init_node);
    show(init_node);
    playing = true;
    aStar();
  }
  
  function shuffle() {
    //var res = [1, 2, 3, 8, 9, 4, 7, 6, 5];
    var res = [2, 8, 3, 1, 6, 4, 7, 9, 5];
    var tmp = 7;
    // solution will occur within 100 steps
    var STEPS = Math.floor(Math.random() * 20);
    for(var i = 0; i < STEPS; i++) {
      var randir = Math.floor(Math.random() * 4)
      // move up blank
      if(randir == 0) {
        if(tmp <= 2) continue;
        res[tmp] = res[tmp-3];
        res[tmp-3] = 9;
        tmp -= 3;
      }
      //move left
      else if(randir == 1) {
        if(Math.round(tmp%3) == 0) continue;
        res[tmp] = res[tmp-1];
        res[tmp-1] = 9;
        tmp -= 1;
      }
      //move down
      else if(randir == 2) {
        if(tmp >= 6) continue;
        res[tmp] = res[tmp+3];
        res[tmp+3] = 9;
        tmp += 3;
      }
      // move right
      else {
        if(Math.round((tmp+1)%3) == 0) continue;
        res[tmp] = res[tmp+1];
        res[tmp+1] = 9;
        tmp += 1;
      }
      
    }
    /*for(var i = 0; i < 10; i++) {
      res.sort(function() {
        return Math.random()>0.5?-1:1;
      });
      for(var j = 0; j < 9; j+=3) {
        tmp = res[j];
        res[j] = res[j+1];
        res[j+1] = res[j+2];
        res[j+2] = tmp;
      }
    }*/
    if(checkPairs(res)) {
      var array = new Array();
      for(var i = 0; i < 3; i++) {
        array[i] = new Array(i);
        for(var j = 0; j < 3; j++) {
          array[i][j] = res[i*3+j];
        }
      }
      return array;
    }
    else return shuffle();
  }
  
  function show(node) {
    for(var i = 0; i < grids.length; i++) {
      var temp = String(node.list[parseInt(i/3)][Math.round(i%3)]);
      if(temp == "9")
        temp = " ";
      grids.eq(i).text(temp);
    }
    // TODO add nodes to open list
    $(".content p").eq(1).text("Step i: " + steps); 
    if(playing) {
      $(".content p").eq(2).text("Open: "+open.length + " nodes");
      //TODO: show var all
      //$(".content p").eq(3).text("Expanded: " + all + " nodes");
    }
    else {
       $(".content p").eq(2).text("Open: 0 nodes");
       //delete all nodes
       $(".content p").eq(3).nextAll().empty();
     }
  }
  
  function showPath(node) {
    while(node != null) {
      //console.log(node.list);
      var tmpstr = "<p>";
      for(var i = 0; i < 3; i++) {
        for(var j = 0; j < 3; j++) {
          tmpstr += node.list[i][j];
          tmpstr += " ";
        }
        if(i != 2) tmpstr += "<br/>";
      }
      var insert = $(tmpstr+"<sp/>h(n)="+node.h+"</p>");
      $(".content").append(insert);
      node = node.parent;
    }
  }

  function diff(state_a, state_b) {
    var count = 0;
    for(var i = 0; i < 3; i++) {
      for(var j = 0; j < 3; j++) {
        if(state_a.list[i][j] == 9)
          continue;
        if(state_a.list[i][j] != state_b.list[i][j])
          count++;
      }
    }
    return count;
  }
  
  function nodeInList(node, list) {
    for(var i = 0; i < list.length; i++) {
      if(diff(list[i], node) == 0)
        return true;
    }
    return false;
  }
  
  function h1(state_a, state_b) {
    return diff(state_a, state_b);
  }
  
  function h2(state_a, state_b) {
    var count = 0;
    // calculate the shortest path
    for(var i = 0; i < 9; i++) {
      for(var j = 0; j < 9; j++) {
          if(state_a.list[parseInt(i/3)][Math.round(i%3)] == 9 
          || state_b.list[parseInt(j/3)][Math.round(j%3)] == 9)
            continue;   
          if(state_a.list[parseInt(i/3)][Math.round(i%3)] == 
          state_b.list[parseInt(j/3)][Math.round(j%3)])
            count += (Math.abs(parseInt(i/3)-parseInt(j/3)) + 
            Math.abs(Math.round(i%3)-Math.round(j%3)));
      }
    }
    return count;
  }
  
  function checkPairs(li) {
    var count = 0;
    for(var i = 0; i < 8; i++) {
        for(var j = i+1; j < 9; j++) {
              //if(li[parseInt(i/3)][Math.round(i%3)] > 
              //li[parseInt(j/3)][Math.round(j%3)])
              if(li[i] > li[j])
               count++;
        }
    }
    return (count % 2 != 0);
  }
  
  function getNodeFromOpen() {
    var temp = 0;
    var h = open[0].h;
    var g = open[0].g;
    for(var i = 1; i < open.length; i++) {
      var tmph = open[i].h
      var tmpg = open[i].g;
      if((tmph + tmpg) < (h + g)) {
        h = tmph;
        g = tmpg;
        temp = i;
      }
      else if(((tmph + tmpg) == (h + g)) && (tmpg < g)) {
        temp = i;
      }
    }
    var res = new Node(open[temp].list);
    res.h = open[temp].h;
    res.g = open[temp].g;
    res.parent = open[temp].parent;
    open.splice(temp, 1);
    return res;
  }
  
  function aStep(state, dirx, diry) {
    var bx, by;
    var flag = false;
    for(var i = 0; i < 3; i++) {
      for(var j = 0; j < 3; j++) {
        if(state.list[i][j] == 9) {
          bx = i;
          by = j;
          flag = true;
          break;
        }
      }
      if(flag) break;
    }
    
    var tx = bx + dirx;
    var ty = by + diry;
    if(tx >= 0 && tx < 3 && ty >= 0 && ty < 3) {
      var copy = new Array();
      for(var k = 0; k < 3; k++) {
        copy[k] = new Array(k);
        for(var l = 0; l < 3; l++) {
          copy[k][l] = state.list[k][l];
        }
      }
      var new_state = new Node(copy);
      new_state.list[bx][by] = state.list[tx][ty];
      new_state.list[tx][ty] = 9;
      return new_state;
    }
    else {
      return (new Node(null));
    }
  }
  
  function aStar() {
    if(open.length != 0) {
      var temp = getNodeFromOpen();
      closed.push(temp);
      show(temp);
      if(diff(temp, final_node) == 0) {
        playing = false;
        showPath(temp);
        return;
      }
      for(var i = 0; i < 4; i++) {
        var next = aStep(temp, move_dirx[i], move_diry[i]);
        if(next.list == null) continue;
        if(nodeInList(next, closed)) continue;
        //console.log(i);
        //console.log(next);
        next.g = temp.g + 1;
        if(choose_h1) next.h = h1(next, final_node);
        else next.h = h2(next, final_node);
        next.parent = temp;
        var in_open = false;
        for(var j = 0; j < open.length; j++) {
          if(diff(open[j], next) == 0) {
              if(((next.g + next.h) < (open[j].g + open[j].h)) ||
              (((next.g + next.h) == (open[j].g + open[j].h)) && (next.g < next.g))) {
                open[j].g = next.g;
                open[j].h = next.h;
                open[j].parent = next.parent;
                in_open = true;
                break;
              }
          }
        }
        if(!in_open) {
          open.push(next);
          all++;
        }
      }
      steps++;
    }
  }
  
  $(".button").click(function() {
    if(!playing) {
      initial();
    }
    else {
      //alert(choose_h1);
      aStar();
      if(!playing) { 
        alert("Find a solution!");
        if(choose_h1) {
          $(".content p").eq(0).text("h2(n): ");
          choose_h1 = false;
        }
        else {
          $(".content p").eq(0).text("h1(n): ");
          choose_h1 = true;
        }
      }
    }
  });
});

