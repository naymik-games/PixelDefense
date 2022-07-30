/* 

const this.width = 14; // Dungeon width
const this.height = 22; // Dungeon height
const this.roomInterval = 5; // Room density (3+)
const this.minRoom = 3; // Min room size. Must be this.roomInterval - 2 or bigger
const this.extraDoors = 5; // Additional doors for better connectivity */

arrayInstruments();
////genDungeon();
//showDungeon();


// Displays primitive map of the dungeon
/* function showDungeon() {
  for (var x = 0; x < this.width; x++) {
    for (var y = 0; y < this.height; y++) {
      switch (dungeon[x][y]) {
        case 0:
          ctx.beginPath();
          ctx.fillStyle = "lightgrey";
          ctx.rect(x * 20, y * 20, 18, 18);
          ctx.fill();
          break;
        case 1:
          ctx.beginPath();
          ctx.fillStyle = "black";
          ctx.rect(x * 20, y * 20, 18, 18);
          ctx.fill();
          break;
        case 2:
          ctx.beginPath();
          ctx.fillStyle = "black";
          ctx.rect(x * 20 + 1, y * 20 + 1, 16, 16);
          ctx.rect(x * 20 + 12, y * 20 + 6, 2, 4);
          ctx.stroke();
          break;
      }
    }
  }
} */

class Rooms {
  constructor(width, height, minRoom, roomInterval, extraDoors) {
    this.width = width
    this.height = height
    this.minRoom = minRoom
    this.roomInterval = roomInterval
    this.extraDoors = extraDoors
    this.dungeon = new Array();
    this.dungeon.dup(1, 0, 0, this.width, this.height);
    this.map = this.genDungeon()
  }
  genDungeon() {

    // Fill full dungeon with walls


    // Create random seeds of growth in size this.minRoom x this.minRoom
    var seeds = new Array();
    while (true) {
      var free = this.dungeon.biggestFree(0, 0, 0, this.width, this.height);
      if (free.biggest < this.roomInterval) {
        break;
      } else {
        var roomX = free.x + 1 + this.rnd(free.biggest - 1 - this.minRoom);
        var roomY = free.y + 1 + this.rnd(free.biggest - 1 - this.minRoom);
        this.dungeon.dup(0, roomX, roomY, this.minRoom, this.minRoom);
        seeds.push({
          x: roomX,
          y: roomY,
          width: this.minRoom,
          height: this.minRoom,
          delete: "no"
        });
      }
    }

    var rooms = [];

    // Now we have seeds of growth in array rooms.
    // Lets try to expand seeds by moving their walls
    while (seeds.length > 0) {
      for (var i = 0; i < seeds.length; i++) {
        // Determine the directions in which the room can grow 
        var dirs = [];
        if (seeds[i].x >= 2 && this.dungeon.freeRect(0, seeds[i].x - 2, seeds[i].y - 1, 1, seeds[i].height + 2)) {
          dirs.push('left');
        }
        if (seeds[i].x + seeds[i].width < this.width - 1 && this.dungeon.freeRect(0, seeds[i].x + seeds[i].width + 1, seeds[i].y - 1, 1, seeds[i].height + 2)) {
          dirs.push('right');
        }
        if (seeds[i].y >= 2 && this.dungeon.freeRect(0, seeds[i].x - 1, seeds[i].y - 2, seeds[i].width + 2, 1)) {
          dirs.push('up');
        }
        if (seeds[i].y + seeds[i].height < this.height - 1 && this.dungeon.freeRect(0, seeds[i].x - 1, seeds[i].y + seeds[i].height + 1, seeds[i].width + 2, 1)) {
          dirs.push('down');
        }

        // Now expand room in random direction
        if (dirs.length > 0) {
          dirs.shuffle();
          if (dirs[0] == 'left') {
            this.dungeon.dup(0, seeds[i].x - 1, seeds[i].y, 1, seeds[i].height);
            seeds[i].x--;
            seeds[i].width++;
          }
          if (dirs[0] == 'right') {
            this.dungeon.dup(0, seeds[i].x + seeds[i].width, seeds[i].y, 1, seeds[i].height);
            seeds[i].width++;
          }
          if (dirs[0] == 'up') {
            this.dungeon.dup(0, seeds[i].x, seeds[i].y - 1, seeds[i].width, 1);
            seeds[i].y--;
            seeds[i].height++;
          }
          if (dirs[0] == 'down') {
            this.dungeon.dup(0, seeds[i].x, seeds[i].y + seeds[i].height, seeds[i].width, 1);
            seeds[i].height++;
          }
        } else {
          seeds[i].delete = "yes";
          rooms.push(seeds[i]);
        }
        seeds = seeds.filter(o => o.delete == "no");
      }
    }

    // Make required doors
    var startRoom = rooms[0];
    startRoom.parentRoom = startRoom;
    this.connectToOtherRooms(rooms, startRoom);

    // Make extra doors
    var i = this.extraDoors;
    var limiter = 1000; // protection from an infinite loop
    while (i > 0 && limiter > 0) {
      if (this.connectToRandom(rooms)) {
        i--;
      }
      limiter--;
    }
    return this.dungeon
  }
  connectToOtherRooms(rooms, currentRoom) {
    var adyacentRoom = this.connectToAdyacent(rooms, currentRoom);
    if (adyacentRoom) {
      this.connectToOtherRooms(rooms, adyacentRoom);
    } else {
      if (currentRoom.parentRoom == currentRoom) {
        return;
      } else {
        this.connectToOtherRooms(rooms, currentRoom.parentRoom);
      }
    }
  }

  // Makes door to the adyacent room
  connectToAdyacent(rooms, room) {
    var nonVisitedRooms = rooms.filter(o => o != room && !o.parentRoom);
    for (var i = 0; i < nonVisitedRooms.length; i++) {
      var nonVisitedRoom = nonVisitedRooms[i];
      if (this.makeDoor(room, nonVisitedRoom)) {
        nonVisitedRoom.parentRoom = room;
        return nonVisitedRoom;
      }
    }
  }


  // Makes door to the random room nearby
  connectToRandom(allRooms) {
    var room = this.rnd(allRooms.length);
    for (var i = 0; i < allRooms.length; i++) {
      if (this.makeDoor(allRooms[room], allRooms[i])) {
        return true;
      }
    }
    return false;
  }


  // Makes door between two rooms
  makeDoor(room1, room2) {
    var walls = this.commonWalls(room1, room2);
    if (walls && !this.foundDoor(walls)) {
      walls.shuffle();
      this.dungeon[walls[0].x][walls[0].y] = 0;
      return true;
    } else {
      return false;
    }
  }


  // Checks if there is a door in walls already to avoid double doors
  foundDoor(walls) {
    for (var i = 0; i < walls.length; i++) {
      if (this.dungeon[walls[i].x][walls[i].y] > 1) {
        return true;
      }
    }
    return false;
  }


  // Returns array of cells between two rooms (if any)
  commonWalls(room1, room2) {
    var walls = new Array();
    var per1 = this.perimeter(room1);
    var per2 = this.perimeter(room2);
    for (var i = 0; i < per1.length; i++) {
      var common = per2.filter(o => o.x == per1[i].x && o.y == per1[i].y);
      if (common.length > 0) {
        walls.push(common[0]);
      }
    }
    if (walls.length > 0) {
      return walls;
    } else {
      return false;
    }
  }


  // Returns array of cells on the external perimeter of room
  // Corner cells are excluded, since the door is not made there
  perimeter(room) {
    var per = new Array();
    for (var x = room.x; x < room.x + room.width; x++) {
      per.push({
        x: x,
        y: room.y - 1
      });
      per.push({
        x: x,
        y: room.y + room.height
      });
    }
    for (var y = room.y; y < room.y + room.height; y++) {
      per.push({
        x: room.x - 1,
        y: y
      });
      per.push({
        x: room.x + room.width,
        y: y
      });
    }
    return per;
  }


  // rnd(4): returns 0, 1, 2 or 3
  rnd(ceil) {
    return Math.floor(Math.random() * ceil);
  }


}
// Generates dungeon of rooms and doors


function rnd(ceil) {
  return Math.floor(Math.random() * ceil);
}
// Several instruments that I need to work with arrays
function arrayInstruments() {

  // Shuffles array in random order
  Array.prototype.shuffle = function () {
    var j, temp;
    for (var i = 0; i < this.length; i++) {
      j = rnd(this.length);
      temp = this[i];
      this[i] = this[j];
      this[j] = temp;
    }
    return (this);
  }

  // Fills rectangle in 2D-array with filler
  Array.prototype.dup = function (filler, startX, startY, lengthX, lengthY) {
    for (var x = startX; x < startX + lengthX; x++) {
      if (!Array.isArray(this[x])) {
        this[x] = new Array();
      }
      for (var y = startY; y < startY + lengthY; y++) {
        this[x][y] = filler;
      }
    }
  }


  // Checks whether the specified area of the two-dimensional array is free of filler
  // If it is free, it returns true
  Array.prototype.freeRect = function (filler, startX, startY, lengthX, lengthY) {
    for (var x = startX; x < startX + lengthX; x++) {
      for (var y = startY; y < startY + lengthY; y++) {
        if (this[x][y] == filler) {
          return false;
        }
      }
    }
    return true;
  }


  // Returns the coordinates of the largest empty square.
  // If there are several equally large empty squares, returns the coordinates of the random
  Array.prototype.biggestFree = function (filler, startX, startY, lengthX, lengthY) {
    var found = new Array();
    for (biggest = Math.min(lengthX, lengthY); biggest > 0; biggest--) {
      for (var x = startX; x <= startX + lengthX - biggest; x++) {
        for (var y = startY; y <= startY + lengthY - biggest; y++) {
          if (this.freeRect(filler, x, y, biggest, biggest)) {
            found.push({
              x: x,
              y: y
            });
          }
        }
      }
      if (found.length > 0) {
        found.shuffle();
        return {
          biggest: biggest,
          x: found[0].x,
          y: found[0].y
        };
      }
    }
  }
}
