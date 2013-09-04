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
{
	this.category = '土地正義';
	this.subject = translateSubject('判決');
	return this;
}

var current_query = new QueryObject();

function renderResult(json_data)
{
  var query_prompt = '<h3>Your query is:</h3><p>';
  query_prompt += 'Category = ' + current_query.category + ', ';
  query_prompt += 'Subject = ' + current_query.subject;
  query_prompt += '<br/></p>';

  var result_context = '<h3>Raw json data:</h3><p>';
  result_context += JSON.stringify(json_data);
  result_context += '</p>';

	$('#category-header').html(current_query.category);
	$('#list-content').html(
    query_prompt + result_context
    );
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