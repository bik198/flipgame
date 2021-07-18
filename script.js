
function _defineProperty(obj, key, value) {if (key in obj) {Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true });} else {obj[key] = value;}return obj;}

// class PlayFooter extends React.Component {
//   constructor(props) {
//     super(props);
//   }
//
//   render() {
//   }}


class Tile extends React.Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    if (this.props.status === "unselected") {
      this.props.onClickListener(this.props.index);
    } else {
      console.warn("The tile has already been " + this.props.status);
    }
  }

  render() {
    return /*#__PURE__*/(
      React.createElement("div", {
        onClick: this.handleClick,
        className:
        "tile " + (
        this.props.status === "selected" ?
        "tile--selected" :
        this.props.status === "matched" ?
        "tile--selected tile--matched" :
        "") }, /*#__PURE__*/


      React.createElement("div", { className: "tile--front" }), /*#__PURE__*/
      React.createElement("div", { className: "tile--back",
        style: { backgroundColor: this.props.accent } },

      this.props.icon)));



  }}


class PlayArea extends React.Component {

  constructor(props) {

    super(props);_defineProperty(this, "tiles",
        [{ name: "face-with-tears-of-joy", accent: "red", icon: "1" },
          { name: "turkey", accent: "orange", icon: "2" },
          { name: "monkey-face", accent: "yellow", icon: "3" },
          { name: "ear-of-maize", accent: "green", icon: "4" },
          { name: "snowman-without-snow", accent: "blue", icon: "5" },
          { name: "beer-mug", accent: "purple", icon: "6" },
          { name: "thinking-face", accent: "brown", icon: "7" },
          { name: "racing-car", accent: "black", icon: "8" }]);

      this.state = {
      tiles: [],
      moves: 0,
      activeTile: null,
      elapsed: 0 };



    this.handleClick = this.handleClick.bind(this);
    this.resetPlayArea = this.resetPlayArea.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.gameOver !== this.props.gameOver && nextProps.gameOver) {
      clearInterval(this.timer);

      this.setState({ elapsed: 0 });
    }
  }
  componentDidMount() {
    this.timer = setInterval(() => {
      if (this.state.moves != 0)
        // this.setState({ elapsed: 0 })
        this.setState({ elapsed: this.state.elapsed + 1 });
    }, 1000);
  }



  shuffleTiles(tiles) {
    let j, x, i;

    for (i = tiles.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = tiles[i];
      tiles[i] = tiles[j];
      tiles[j] = x;
    }

    return tiles;
  }

  multiplyTiles(tiles) {
    return tiles.
    map(item => {
      // Use Object.assign to create a new object rather than passing the same reference twice
      return [item, Object.assign({}, item)];
    }).
    reduce((a, b) => {
      return a.concat(b);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.gameOver !== this.props.gameOver && !nextProps.gameOver) {
      const newTiles = this.tiles.map(e => {
        e.status = "unselected";

        return e;
      });

      this.setState({
        tiles: this.shuffleTiles(this.multiplyTiles(newTiles)) });

    }
  }

  handleClick(index) {
    // Update moves on every click
    this.setState({ moves: this.state.moves + 1 });

    const selectedTile = this.state.tiles[index];
    const updatedTiles = this.state.tiles.slice();

    selectedTile.status = "selected";
    updatedTiles[index] = selectedTile;

    this.setState({
      tiles: updatedTiles });


    if (this.state.activeTile === null) {
      this.setState({
        activeTile: selectedTile });

    } else if (selectedTile.name === this.state.activeTile.name) {
      let matched = 0;

      const updatedTiles = this.state.tiles.map(e => {
        if (e.name === selectedTile.name) e.status = "matched";
        if (e.status === "matched") matched++;

        return e;
      });

      this.setState({
        tiles: updatedTiles,
        activeTile: null });


      if (matched === 16) this.resetPlayArea();
    } else {
      const _this = this;

      setTimeout(function () {
        const updatedTiles = _this.state.tiles.map(e => {
          if (
          e.name === _this.state.activeTile.name ||
          e.name === selectedTile.name)
          {
            e.status = "unselected";
          }

          return e;
        });

        _this.setState({
          activeTile: null,
          tiles: updatedTiles });

      }, 700);
    }
  }

  resetPlayArea() {
    this.props.onGameOver(this.state.moves);

    this.setState({
      tiles: [],
      moves: 0,
      activeTile: null });

  }

  render() {
    let cindex = 0;
    return /*#__PURE__*/(
      React.createElement("div", { className: "area__wrapper" }, /*#__PURE__*/
      React.createElement("h1", { className: "area__head" }, "FLIP THE CARDS TO MATCH THE PAIRS"), /*#__PURE__*/
          // React.createElement("p", null, "Your Moves : ", this.state.moves),
          React.createElement("p", null, "Your Time : ", this.state.elapsed, " Seconds"),
      React.createElement("ul", { className: "area" },
      this.state.tiles.map((e) => /*#__PURE__*/
      React.createElement(Tile, {
        index: cindex++,
        status: e.status,
        icon: e.icon,
        accent: e.accent,
        onClickListener: this.handleClick }))),



      // !this.props.gameOver ? /*#__PURE__*/
      // React.createElement(PlayFooter, { moves: this.state.moves, gameOver: this.props.gameOver }) :
      // null
      ));


  }}


class PlayModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return /*#__PURE__*/(
      React.createElement("div", { className: this.props.gameOver ? "modal__wrapper" : "hidden" }, /*#__PURE__*/
      React.createElement("div", { className: "modal" }, /*#__PURE__*/
      React.createElement("div", { className: "modal--top overlay" }, /*#__PURE__*/
      React.createElement("p", null, /*#__PURE__*/
      React.createElement("b", null, "Your Score"), " : ", this.props.highScore, " seconds")), /*#__PURE__*/
      React.createElement("div", { className: "modal--bottom" }, /*#__PURE__*/
      React.createElement("button", { className: "modal__btn", onClick: this.props.onPlayClick }, "Play")))));
  }}


class App extends React.Component {
  constructor() {
    super();

    this.state = {
      score: 0,
      gameOver: true };


    this.initCards = this.initCards.bind(this);
    this.restartGame = this.restartGame.bind(this);
  }

  initCards() {
    this.setState({
      score: 0,
      gameOver: false });

  }

  restartGame(elapsed) {
    const score = Math.round(elapsed);

    this.setState({
      // elapsed: 0,
      score: score,
      gameOver: true });

  }

  render() {
    return /*#__PURE__*/(
      React.createElement("div", null, /*#__PURE__*/
      React.createElement(PlayModal, {
        gameOver: this.state.gameOver,
        highScore: this.state.score,
        onPlayClick: this.initCards }), /*#__PURE__*/

      React.createElement(PlayArea, {
        gameOver: this.state.gameOver,
        onGameOver: this.restartGame })));



  }}


ReactDOM.render( /*#__PURE__*/React.createElement(App, null), document.getElementById("root"));