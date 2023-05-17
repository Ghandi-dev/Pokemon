$.ajax({
  url: "https://pokeapi.co/api/v2/pokemon",
  success: function (res) {
    let text = "";
    console.log(res.results)
    $.each(res.results, function (key, val) {
      let img = pokemonImage(val.url)
      text += `
        <div class="col">
                    <div class="card">
                        <img src="${img}" class="card-img-top" alt="...">
                        <div class="card-body">
                            <h5 class="card-title">${val.name}</h5>
                            <p class="card-text">This is a longer card with supporting text below as a natural lead-in to
                                additional
                                content. This content is a little bit longer.</p>
                        </div>
                    </div>
                </div>
      `;
    });

    $(".poke").html(text);
  },
});

function pokemonImage(data) {
  let result = "Erorr";
  $.ajax({
    url: `${data}`,
    type: 'GET',
    async: false,
    success: function (res) {
      result = res.sprites.front_default;
    }
  });
  return result
}