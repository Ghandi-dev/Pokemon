$.ajax({
  url: "https://pokeapi.co/api/v2/pokemon",
  success: function (res) {
    console.log(res.results);
  },
});
