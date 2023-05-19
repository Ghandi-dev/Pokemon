const url2 = "https://pokeapi.co/api/v2/pokemon?offset=168&limit=12";

showPoke(url2);

const ctx = document.getElementById("myChart");

let dataSkill = {
  labels: ["Hp", "Atk", "Df", "Sp-Atk", "Sp-Df", "Spd"],
  datasets: [
    {
      data: [65, 59, 90, 81, 56, 100],
      fill: true,
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgb(255, 99, 132)",
      pointBackgroundColor: "rgb(255, 99, 132)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgb(255, 99, 132)",
    },
    {
      data: [120, 120, 120, 120, 120],
      fill: false,
      backgroundColor: "rgba(255, 99, 132, 0)",
      borderColor: "rgb(255, 99, 132,0)",
      pointBackgroundColor: "rgb(255, 99, 132,0)",
      pointBorderColor: "#fff",
      pointHoverBackgroundColor: "#fff",
      pointHoverBorderColor: "rgb(255, 99, 132,0)",
    },
  ],
};

function showPoke(data) {
  let prev = "";
  let next = "";
  $.ajax({
    url: `${data}`,
    dataType: "JSON",
    async: false,
    success: function (res) {
      if (res.previous === null) {
        prev = "disabled";
      } else if (res.next === null) {
        next = "disabled";
      }
      let button = `<button type="button" onclick="showPoke('${res.previous}')" class="btn btn-dark btn-lg" ${prev}>Prev</button>
                    <button type="button" onclick="showPoke('${res.next}')" class="btn btn-dark btn-lg ${next}">Next</button>`;
      let text = "";
      $.each(res.results, function (key, val) {
        let img = pokemonImage(val.name);
        let color = bgColorCardConverter(pokemonType(val.name)[0].type.name);
        let type = pokemonType(val.name)[0].type.name;
        let detail = [img.other.home.front_default, type, val.name, color];
        text += `
          <div class="col" >
                      <div class="card" style="background-color:${color}">
                          <img src="${img.front_default}" class="card-img-top" alt="...">
                          <div class="card-body">
                              <h5 class="card-title text-center text-uppercase ">${val.name}</h5>
                                <div class="d-grid gap-2 col-12 mx-auto">
                                  <button data-bs-toggle="modal"
                                  data-bs-target="#staticBackdrop" onclick="showDetail('${detail}')" class="btn btn-outline-dark" type="button">Detail</button>
                                </div>
                          </div>
                      </div>
                  </div>
        `;
      });

      $(".poke").html(text);
      $(".buttonShowPoke").html(button);
    },
  });
}

function pokemonImage(data) {
  let result = "Erorr";
  $.ajax({
    url: `https://pokeapi.co/api/v2/pokemon/${data}`,
    type: "GET",
    async: false,
    success: function (res) {
      result = res.sprites;
    },
  });
  return result;
}

function pokemonType(data) {
  let result = "Erorr";
  $.ajax({
    url: `https://pokeapi.co/api/v2/pokemon/${data}`,
    type: "GET",
    async: false,
    success: function (res) {
      result = res.types;
    },
  });
  return result;
}

function showDetail(data) {
  let chartStatus = Chart.getChart("myChart");
  if (chartStatus != undefined) {
    chartStatus.destroy();
  }
  let arr = data.split(",");
  $.ajax({
    url: `https://pokeapi.co/api/v2/pokemon/${arr[2]}`,
    success: function (result) {
      dataSkill.datasets[0].data = [
        result.stats[0].base_stat,
        result.stats[1].base_stat,
        result.stats[2].base_stat,
        result.stats[3].base_stat,
        result.stats[4].base_stat,
        result.stats[5].base_stat,
      ];
      let text = `${result.name}`;
      let text1 = `<img src="${arr[0]}" class="card-img-top">`;
      let text3 = `<div class="col-2 border border-4 shadow">
                      <img src="${result.sprites.back_default}" alt="" width="100px" height="100px">back
                  </div>
                  <div class="col-2 ms-2 border border-4 shadow">
                      <img src="${result.sprites.front_default}" alt="" width="100px" height="100px">front
                  </div>
                  <div class="col-7 ms-2 border border-4 shadow">
                    <div class="row mt-2">
                      <div class="col-6 text-start" style="font-size: 14px;">
                        Weight : ${result.weight} kg
                      </div>
                    </div>
                    <div class="row mt-2">
                      <div class="col-6 text-start" style="font-size: 14px;">
                        Height : ${result.height} ft
                      </div>
                    </div>
                  </div>`;
      let text2 = "";
      $.each(result.types, function (key, val) {
        let color = bgColorCardConverter(val.type.name);
        text2 += `<div class="col-3 m-2 badge text-wrap" style="background-color:${color};">
                      ${val.type.name}
                  </div>`;
      });
      let mv = "";
      $.each(result.moves, function (key, val) {
        mv += `${val.move.name}, `;
      });
      $("#mvPoke").html(mv);
      $("#otherDisplay").html(text3);
      $("#name").html(text);
      $("#detailImg").html(text1);
      $('[id^="modalPoke"]').css({ "background-color": arr[3] });
      $('[id^="name"]').css({ "background-color": arr[3] });
      $("#typeDetail").html(text2);
    },
  });
  new Chart(ctx, {
    type: "radar",
    data: dataSkill,
    options: {
      scales: {
        r: {
          pointLabels: {
            font: {
              size: 20,
            },
          },
        },
      },
      elements: {
        line: {
          borderWidth: 3,
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
}

function bgColorCardConverter(type) {
  const colorType = {
    fire: "#ee8130",
    grass: "#7ac74c",
    electric: "#f7d02c",
    water: "#6390f0",
    ground: "#e2bf65",
    rock: "#b6a136",
    fairy: "#d685ad",
    poison: "#a33ea1",
    bug: "#a6b91a",
    dragon: "#6f35fc",
    psychic: "#f95587",
    flying: "#a98ff3",
    fighting: "#c22e28",
    normal: "#a8a77a",
    ice: "#96d9d6",
    ghost: "#735797",
    dark: "#705746",
    steel: "#b7b7ce",
  };

  return colorType[type];
}
