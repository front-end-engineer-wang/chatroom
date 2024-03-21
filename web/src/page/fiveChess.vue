<template>
  <div>
    <h3 ref="title" class="title">--五子棋--</h3>
    <canvas class="chess" width="450px" height="450px"></canvas>
    <div>
      <a class="res">restart</a>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
    };
  },
  created() {
  },
  mounted() {
    let chess = document.getElementsByClassName('chess')[0];//获取chess画布
    let title = this.$refs.title;//获取标题
    // 获取2d画布的上下文
    let cxt = chess.getContext("2d");
    // 线的颜色
    cxt.strokeStyle = "#b9b9b9";
    window.onload = function () {
      drawChessBoard();
    }
    function drawChessBoard() {
      for (let i = 0; i < 15; i++) {
        // 从canvas画布位置开始计算
        // 每条横线起始点位置
        cxt.moveTo(15, 15 + i * 30);
        // 每条横线终点位置
        cxt.lineTo(435, 15 + i * 30);
        // 使用stroke方法连
        cxt.stroke();
        // 竖线同上
        cxt.moveTo(15 + i * 30, 15);
        cxt.lineTo(15 + i * 30, 435);
        cxt.stroke();
      }
    }


    // 设置赢法数组,3维数组，前两个代表坐标位置，赢法编号
    // 例：
    // [0,0,0]/[1,0,0]/[2,0,0]/[3,0,0]/[4,0,0] 从棋盘左上角开始往右五个棋子
    // [1,0,1]/[2,0,1]/[2,0,1]/[3,0,1]/[5,0,1] 从棋盘左上角后面一个开始往右五个棋子
    // 初始化数组
    let wins = [];
    for (let i = 0; i < 15; i++) {
      wins[i] = [];
      for (let j = 0; j < 15; j++) {
        wins[i][j] = [];
      }
    }
    // 设置赢法编号
    let id = 0;
    // 统一横线赢法，即横着连成5个子
    // 横坐标i的起始位置只能到11，再往后就没法赢了
    for (let i = 0; i < 11; i++) {
      for (let j = 0; j < 15; j++) {
        for (let k = 0; k < 5; k++) {
          wins[i + k][j][id] = true
        }
        id++;
      }
    }

    // 统计竖线赢法
    for (let i = 0; i < 11; i++) {
      for (let j = 0; j < 15; j++) {
        for (let k = 0; k < 5; k++) {
          wins[j][i + k][id] = true
        }
        id++;
      }
    }

    // 统计正斜线,从左上连到右下角
    for (let i = 0; i < 11; i++) {
      for (let j = 0; j < 11; j++) {
        for (let k = 0; k < 5; k++) {
          wins[j + k][i + k][id] = true;
        }
        id++;
      }
    }

    // 统计反斜线,从右上连到左下角
    for (let i = 0; i < 11; i++) {
      for (let j = 14; j >= 4; j--) {
        for (let k = 0; k < 5; k++) {
          wins[i + k][j - k][id] = true;
        }
        id++;
      }
    }

    // 定义二维数组来存储每个坐标是否已经下了棋子
    let chessBoard = new Array(15).fill(0).map(() => new Array(15).fill(0));
    // 人下棋
    let me = true;//用来标记人是否可以下棋
    let over = false;//标记游戏是否结束
    let myWin = new Array(id).fill(0);//记录用户在每个赢法编号上的分值
    let computerWin = new Array(id).fill(0);//记录计算机在每个赢法编号上的分值
    chess.onclick = function (e) {
      // 游戏结束或者不是自己下棋回合就停止下棋
      if (over) return;
      if (!me) return;
      // 获取x轴坐标,但这个坐标也是根据canvas父元素的偏移量
      let x = e.offsetX;
      // 获取y轴坐标
      let y = e.offsetY;
      let i = Math.floor(x / 30);
      let j = Math.floor(y / 30);
      // 此处没有棋子则可以下棋
      if (chessBoard[i][j] == 0 && me) {
        oneStep(i, j, me);
        // 并将此处标记为已经下过棋子
        chessBoard[i][j] += 1;//此处要用+1而不能用==1
        me = !me
        for (let k = 0; k < id; k++) {
          // 遍历每一个赢法编号,如果同一个编号的分值到达了5个代表赢了
          if (wins[i][j][k]) {
            myWin[k]++;
            if (myWin[k] == 5) {
              title.innerHTML = '恭喜你，你赢了';
              over = true;
            }
          }

        }
      }
      // 计算机落子
      if (!over && !me) {

        computerAI();
        if (!over) {
          me = !me
        }
      }
    }

    // 计算机落子方法
    function computerAI() {
      // 计算在用户旁边落子的分值以及在计算机落子旁边下棋的分值
      // 计算空白子在用户所占用赢法上的分值
      let myScore = new Array(15).fill(0).map(() => new Array(15).fill(0));
      // 空白子在计算机所占用赢法上的分值
      let computerScore = new Array(15).fill(0).map(() => new Array(15).fill(0));
      let max = 0, x = 0, y = 0;//分别存储空白子分数最大值以及空白子最大值所对应的坐标

      for (let i = 0; i < 15; i++) {
        for (let j = 0; j < 15; j++) {
          // 要判断空白位置的分值，已落子的不用管
          if (chessBoard[i][j] == 0) {
            for (let k = 0; k < id; k++) {
              // 代表当前赢法编号上有棋子
              if (wins[i][j][k]) {
                // 用户在此编号的分值
                if (myWin[k] == 1) {
                  myScore[i][j] += 200;
                } else if (myWin[k] == 2) {
                  myScore[i][j] += 400;
                } else if (myWin[k] == 3) {
                  myScore[i][j] += 2000;
                } else if (myWin[k] == 4) {
                  myScore[i][j] += 3000;
                }

                if (computerWin[k] == 1) {
                  computerScore[i][j] += 220;
                } else if (computerWin[k] == 2) {
                  computerScore[i][j] += 420;
                } else if (computerWin[k] == 3) {
                  computerScore[i][j] += 2200;
                } else if (computerWin[k] == 4) {
                  computerScore[i][j] += 3200;
                }
              }
            }
            // 思路就是先去拦截用户的棋子
            if (myScore[i][j] > max) {
              max = myScore[i][j];
              x = i;
              y = j;
            } else if (myScore[i][j] == max) {
              // 不需要拦截用户时，去判断怎么下棋能让计算机更有利
              if (computerScore[i][j] > max) {
                max = computerScore[i][j];
                x = i;
                y = j;
              }
            }

            if (computerScore[i][j] > max) {
              max = computerScore[i][j];
              x = i;
              y = j;
            } else if (computerScore[i][j] == max) {
              if (myScore[i][j] > max) {
                max = myScore[i][j];
                x = i;
                y = j;
              }
            }

          }
        }
      }
      oneStep(x, y, me);

      chessBoard[x][y] += 1;
      for (let k = 0; k < id; k++) {
        if (wins[x][y][k]) {
          computerWin[k]++;
          if (computerWin[k] == 5) {
            title.innerHTML = '你输了！计算机已获胜'
            over = true;
          }
        }
      }

    }
    // 落子的方法
    function oneStep(i, j, me) {
      // 画圆
      cxt.beginPath();
      // 圆心坐标、半径、从0度到2pi度画个完整的圆出来
      cxt.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);
      cxt.closePath();
      let color;
      if (me == true) {
        color = 'black';
      } else {
        color = 'red';
      }
      cxt.fillStyle = color;
      cxt.fill();
    }
  },
  methods: {
  },

};
</script>

<style lang="scss" scoped>
.title {
  text-align: center;
}

.chess {
  /* canvas与image一样虽然可以设置高和宽，但是是行内块，所以把它变成块元素，方便用margin居中 */
  display: block;
  margin: 50px auto;
  /* 阴影往下往右是正数，前两个值代表往下往右的偏移量，第三个代表阴影宽度，最后一个是阴影颜色 */
  box-shadow: 5px 5px 5px #b9b9b9, -2px -2px 2px #efefef;
  cursor: pointer;
}

div {
  text-align: center;
}

.res {
  padding: 10px 20px;
  background-color: pink;
  border-radius: 10px;
  color: white;
  cursor: pointer;
}
</style>