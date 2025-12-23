import { update_map } from './world_map.js';
import { update_plot_budget , budget } from './cycle_plot3.js';
import { plotting_genre , genre } from './genre.js';
import { plotting_lines, bin_size, start_val, end_val, rating , update_smoothing} from './rating.js';
import { plotting_gender } from './gender.js';
import { plotting_timeline, decades , columns } from './timeline.js';

// var elem = document.documentElement;
// function openFullscreen() {

//   if (elem.requestFullscreen) {
//     elem.requestFullscreen();
//   } else if (elem.webkitRequestFullscreen) { /* Safari */
//     elem.webkitRequestFullscreen();
//   } else if (elem.msRequestFullscreen) { /* IE11 */
//     elem.msRequestFullscreen();
//   }
// }

// function closeFullscreen() {
// if (document.exitFullscreen) {
//   document.exitFullscreen();
// } else if (document.webkitExitFullscreen) { /* Safari */
//   document.webkitExitFullscreen();
// } else if (document.msExitFullscreen) { /* IE11 */
//   document.msExitFullscreen();
// }
// }

const r1 = document.querySelector("input");
r1.addEventListener("change", changeHandler);
function changeHandler() {
    plotting_genre(global_genre_count, global_genre_sucess, global_link_count);
}

function range_selector(value){
  document.getElementById("Left").style.fontSize = (20 + 2 * (5 - value)) + "px"
  document.getElementById("Right").style.fontSize = (20 + 2 * (value - 5)) + "px"
  localStorage.update_genre = false;
  plotting_all(value / 10);
  return +value / 10;
}  

function range_selector2(value){
  update_smoothing(value)
}  

var possible_gender_category = [0,1,2,3]

// var current_country = "USA"
var first_time = true; 
var global_genre_sucess, global_genre_count, global_link_count; 
var alpha;
function plotting_all(new_alpha= alpha){

  alpha = new_alpha;
  var country_data = {};
  var data_by_budget = {};
  var gender_data = {};
  var genre_sucess={};
  var genre_count={};
  var link_count={};
  var rating_dict = {};
  var timeline_data = {};
  var max_bin = 0;
  var min_bin = 500;

  genre.forEach(function(key) {
    genre_count[key] = 0;
    genre_sucess[key] = 0 ;
    link_count[key] = {};
    genre.forEach(function(key2) {
      if (key2 != key) link_count[key][key2] = 0 ;
    });
  });

  possible_gender_category.forEach(no_females => {
      gender_data[no_females] = [0,0]
  });

  rating.forEach(key =>{
    rating_dict[key] = []
    var curr=start_val
    while(curr <= end_val){
      rating_dict[key].push([0,0])
      curr += bin_size 
    }
  });
  
  
  decades.forEach(decade => {
    timeline_data[decade] = {}
    columns.forEach(month => {
      timeline_data[decade][month] = [0,0]
    });
  });

  budget.forEach(budget_category => {
    data_by_budget[budget_category] = []
  });
  
  d3.csv("data/movies.csv", function (error, data) {

    for (var movie_index =0 ; movie_index <= data.length-1; movie_index +=1 ){

      var movie = data[movie_index]
      var nature_of_profit = movie.nature_profit
      var budget_category = movie.budget_category
      var country_code = movie.country_code
      var decade = movie.decade
      var rating = movie.rating;

      if (localStorage.current_country != -1 & country_code != localStorage.current_country){
        continue;
      }
      if (localStorage.budget_range != -1 & budget_category != localStorage.budget_range){
        continue;
      }
      if (localStorage.decade != -1 & decade != localStorage.decade){
        continue;
      }
      if (localStorage.rating != -1 & rating != localStorage.rating){
        continue;
      }
      
      var female_count = +movie.female_count
      var month = movie.months
      var bin_index = Math.floor((+movie.runtime - start_val) / bin_size)        
      var sucess = ((1-alpha) * +movie.profit) + (alpha * +movie.nominations);
      
      if ((country_code in country_data) == false){
          country_data[country_code] = [0,0]  
      }
      
      data_by_budget[budget_category].push({
        "sucess" : sucess,
        "accolades" : +movie.accolades,
        "budget" : +movie.budget,
        "nature" : +nature_of_profit, 
      })

      country_data[movie.country_code][0] += sucess
      country_data[movie.country_code][1] += 1

      gender_data[female_count][0] += sucess  
      gender_data[female_count][1] += 1  

      min_bin = Math.min(min_bin , bin_index)
      max_bin = Math.max(max_bin , bin_index)

      rating_dict[rating][bin_index][0] += sucess
      rating_dict[rating][bin_index][1] += 1

      if (decade != "2020"){
        timeline_data[decade][month][0] += sucess  
        timeline_data[decade][month][1] += 1
      }


      for (let i = 1; i <=3 ; i++) {
          var key='genre'+i
          if (movie[key] != 'nan' & genre.includes(movie[key]) == true){
            genre_count[movie[key]] += 1
            genre_sucess[movie[key]] += sucess;
            for (let j = 1; j <=3 ; j++) {
              if (j!=i){
                var loopkey='genre'+j
                if (movie[loopkey] != 'nan' & genre.includes(movie[key]) == true )
                   link_count[movie[key]][movie[loopkey]] +=1
              }
            }
          }
        }
    };

    
    if (localStorage.update_country != -1) {
      console.log(country_data);
      update_map(country_data);
    }
    update_plot_budget(data_by_budget);
    plotting_lines(rating_dict, min_bin, max_bin);
    plotting_timeline(timeline_data);
    plotting_gender(gender_data);

    global_genre_count = genre_count
    global_genre_sucess = genre_sucess
    global_link_count = link_count
    if (first_time) {
      plotting_gender(gender_data);
      first_time = false;  
    }
    
    if (localStorage.update_genre == 'true') {
      plotting_genre(global_genre_count, global_genre_sucess, global_link_count)
    }
  });
}

// svg.selectAll(".cell").nodes()[3]
localStorage.current_country = -1
localStorage.budget_range = -1
localStorage.update_country = 1
localStorage.update_genre = 'true' ;
localStorage.decade = -1;
localStorage.rating = -1;
plotting_all(0.5);

window.range_selector = range_selector;
window.range_selector2 = range_selector2;
var video = document.getElementById("myVideo");

export { plotting_all };   
