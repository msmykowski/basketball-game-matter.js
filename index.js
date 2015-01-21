var hoop = document.getElementsByTagName("p")
var scoreBoard = document.getElementsByClassName("score")
var timeClock = document.getElementsByClassName("timeclock")
scoreBoard[0].innerText = 0



var Engine = Matter.Engine,
World = Matter.World,
Bodies = Matter.Bodies,
Body = Matter.Body
Constraint = Matter.Constraint,
Composites = Matter.Composites,
Events = Matter.Events,
MouseConstraint = Matter.MouseConstraint;

// create a Matter.js engine
var engine = Engine.create(document.body, {
  render: {
    options: {
      wireframes: false,
    }
  }
});


var mouseConstraint = MouseConstraint.create(engine);


// create ground
var ground = Bodies.rectangle(395, 600, 815, 50, { isStatic: true, render: { visible: false } }),
rockOptions = { density: 0.68, restitution: 1.0 },
rock = Bodies.polygon(170, 350, 20, 35, rockOptions),
anchor = { x: 170, y: 350 },
elastic = Constraint.create({
  pointA: anchor,
  bodyB: rock,
  stiffness: 0.05,
  render: {
    lineWidth: 2,
    strokeStyle: '#dfa417'
  }
});

var ball = rock


var groupId = Body.nextGroupId(),
particleOptions = { friction: 0.00001, groupId: groupId, render: { visible: false }},
cloth = Composites.softBody(650, 100, 5, 5, 8, 5, false, 8, particleOptions);

for (var i = 0; i < 5; i++) {
  if (i === 0 || i  === 4)  {
    cloth.bodies[i].isStatic = true;
  }
}

var backboard = Bodies.rectangle(760, 50, 10, 150, { isStatic: true, render: { fillStyle: '#1919FF'} });


Events.on(engine, 'tick', function(event) {

  if (engine.input.mouse.button === -1 && (rock.position.x > 190 || rock.position.y < 330)) {
    rock = Bodies.polygon(170, 350, 20, 35, rockOptions);
    ball = elastic.bodyB
    World.add(engine.world, rock);
    elastic.bodyB = rock;
  }
});


World.add(engine.world, [ground, mouseConstraint, rock, elastic, cloth, backboard, hoop]);

Events.on(engine, 'tick', function(event) {
if (ball.position.x > 618 && ball.position.x < 800 && ball.position.y > 111 && ball.position.y < 117) {
  scoreBoard[0].innerText = parseInt(scoreBoard[0].innerText) + 2
}});


function start(time) {
  if (time <= 0) {
    timeClock[0].innerText = "Game Over";
    World.clear(engine.world, {keepStatic: true});
    clearTimeout(timeKeep);
    console.log(timeClock[0].innerHTML)
  }
  else {
    timeKeep = setTimeout(function() {
      time = time - .01;
      timeClock[0].innerText = time.toFixed(2);
      start(time);
    }, 10);
  }
}

start(2)

// run the engine
Engine.run(engine)
