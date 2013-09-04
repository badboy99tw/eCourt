function translateSubject(subject_name)
// Translate subject name from chinese to english, or vice versa
// XXX: We should get rid of this function some day
{
  var subject_cht_array = ['團體', '法律', '判決', '行動'];
  var subject_eng_array = ['groups', 'laws', 'lawsuits', 'proceedings'];
  var _index = subject_cht_array.indexOf(subject_name);
  if (_index >= 0)
  { // Translate from chinese to english
    return subject_eng_array[_index];
  }
  else
  { // Translate from english to chinese
    _index = subject_eng_array.indexOf(subject_name)
    if (_index >=0 ) 
    {
      return subject_cht_array[_index];
    };

  }
}

function QueryObject()
// Define Prototype/Class QueryObject
{
	this.category = '土地正義';
	this.subject = translateSubject('判決');
	return this;
}

function renderResult(json_data)
{
  var query_prompt = '<h3>Your query is:</h3><p>';
  query_prompt += 'Category = ' + current_query.category + ', ';
  query_prompt += 'Subject = ' + current_query.subject;
  query_prompt += '<br/></p>';

  var result_prompt = '<h3>Result:</h3><p>';
  result_prompt += 'Data count = ' + json_data.length;
  result_prompt += '<br/></p>';

  var result_context = '<h3>Raw json data:</h3><p>';
  result_context += JSON.stringify(json_data);
  result_context += '</p>';

	$('#category-header').html(current_query.category);
	$('#list-content').html(
    query_prompt + result_prompt
    );
  $.each(json_data, function(obj_array, obj)
    {
      var newContext;
      if (subject_templates.hasOwnProperty(current_query.subject) && subject_templates[current_query.subject].template)
      {
        var template = subject_templates[current_query.subject].template;
        var search_id_prefix = subject_templates[current_query.subject].filename;
        newContext = template.clone();
        for (key in obj)
        {
          var search_id = '#' + search_id_prefix + '-' + key;
          var match_element = newContext.find(search_id);
          if (match_element)
          {
            match_element.html(obj[key]);
          }
          else
          {
            alert('Can not match ' + key + ' in ' + groups_div_template_filename);         
          }
        }        
      }
      else
      {
        newContext = $('<div><h2>Can not load html template for <i>' + current_query.subject + '</i></h2></div>');
      }
      var cell_container = $('<div class="list-cell-container"/>');
      cell_container.append(newContext);
      $('#list-content').append(cell_container);
      // var newDiv = $('<div/>', {className:'container'});
      // //newDiv.append($('<p>' + val.title + '</p>'));
      // newDiv.load('/html/groups-brief.html',
      //   function(response, status, xhr)
      //   {
      //     if (status=='error')
      //       {
      //         alert(xhr.status + '\n' + xhr.statusText);
      //         return;
      //       };
      //     $('#list-content').append(newDiv);
      //   });
    });
}

function queryHandle(query_url, query_data)
{
	$.getJSON(query_url, query_data)
  .done(renderResult)
  .fail(function(jqxhr, textStatus, error){
    var err = textStatus + ',' + error;
    var err_msg = '\n資料尚未建立? - (' + current_query.category + ', ' + translateSubject(current_query.subject) + ')\n';
    alert('Request failed:' + err + err_msg);
  });
  
}

function queryCategory(category)
{
	current_query.category = category;
	var query_url = '/api/categories/';
	query_url += current_query.category + '/';
	query_url += current_query.subject + '/';
	queryHandle(query_url, null);
}

function querySubject(subject)
{
  subject = translateSubject(subject);
	current_query.subject = subject;
  var query_url = '/api/categories/';
  query_url += current_query.category + '/';
  query_url += current_query.subject + '/';
  queryHandle(query_url, null);

}

function onLoadedHtml(response, status, xhr)
{
  if (status=='error')
  {
    alert(xhr.status + '\n' + xhr.statusText);
    return;
  }; 
}

function init()
// This function will excute on $(document).ready
{
  // Pre-load external htmls
  for (subject in subject_templates)
  {
    if (subject_templates.hasOwnProperty(subject)) {
      var data = subject_templates[subject];
      var template_path = '/html/' + data.filename + '.' + data.filetype;
      subject_templates[subject].template = $('<div/>');
      subject_templates[subject].template.load(template_path, onLoadedHtml);
    }
  }
  //groups_div_template.load('/html/groups-brief.html', onLoadHtml);
}

// Global variables
var current_query = new QueryObject();
var subject_templates = {
  groups:{template:undefined, filename:'groups-brief', filetype:'html'}
}

// Initialize when html is loaded
$(document).ready(init);
