function QueryObject()
{
	this.category = '土地正義';
	this.subject = '判決';
	return this;
}

var current_query = new QueryObject();

function renderResult()
{
	$('#category-header').html(current_query.category);
	$('#list-content').html('<h2>Query:</h2><p>'
							 + 'Category = ' + current_query.category + '<br/>'
							 + 'Subject = ' + current_query.subject
							 + '</p>'
							 );
}

function queryCategory(category)
{
	current_query.category = category;
	renderResult();
}

function querySubject(subject)
{
	current_query.subject = subject;
	renderResult();
}