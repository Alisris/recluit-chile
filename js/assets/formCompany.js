function searchCompanyForm(obj){
    var question = $(obj).data('question');
    var companyId = $('#question' + question).val();
    CleanModal();
    $mainModal.show();
    $.ajax({
        url:   Routing.generate('alumniForm_search_company', { 'questionId' : question, 'companyId' : companyId }),
        type:  'GET',
        success:  function(response) {
            RenderModal(response);
        }
    });
}

function searchCompanyFormByKeywords(){
    $("#btnSearchCompany").attr("disabled", 'disabled');
    $('#btnShowRegisterButton').addClass('visually-hidden');
    var keywords = $('#companyKeywords').val();
    var country = $('#companyCountry').val();
    if(keywords) {
        $.ajax({
            url: Routing.generate('alumniForm_search_company_by_keywords', {'keywords': keywords, 'countryId': country}),
            type: 'GET',
            success: function (response) {
                if(response.status == 'ok'){
                    companiesList = $('#companiesList');
                    companiesList.empty();
                    if(response.companies.length > 0) {
                        $('#btnShowRegisterButton').addClass('visually-hidden');
                        companiesList.append('<tr><th class="p-1"><strong>Identificación</strong></th><th class="p-1"><strong>Nombre</strong></th><th class="p-1"><strong>Ubicación</strong></th><th class="p-1">Acción</th></tr>');
                        $.each(response.companies, function (i, company) {
                            companiesList.append('<tr><td class="p-1">' + company.identification + '</td><td class="p-1">' + company.name + '</td><td class="p-1">' + company.location + '</td><td class="p-1"><button type="button" class="btn btn-primary btn-sm" onclick="selectingCompany(\'' + company.name + '\', ' + company.id + ')">Seleccionar</button></td></tr>');
                        });
                    }
                    $('#btnShowRegisterButton').removeClass('visually-hidden');
                }
                else{
                    flashMessages({'type': 'error', 'message': response.message });
                }
                $("#btnSearchCompany").removeAttr("disabled");
            }
        });
    }
}

function selectingCompany(name, id){
    if(confirm('¿Desea seleccionar ' + name + '?')) {
        var currentQuestion = $('#currentQuestion').val();
        $('#question' + currentQuestion).val(id);
        $('#company_data_' + currentQuestion).html(name);
        $mainModal.hide();
    }
}

function formCompanyRegister(){
    var name = $('#companyName').val();
    var identification = $('#companyIdentification').val();
    var sector = $('#companySector').val();
    var country = $('#companyCountry').val();
    $("#btnRegisterCompany").attr("disabled", "disabled");
    if(name.length > 3 && identification.length > 3 && sector){
        if(confirm('¿Desea realizar el registro?')) {
            $.ajax({
                url: Routing.generate('alumniForm_search_company_register'),
                type: 'POST',
                dataType: 'json',
                data: {'country' : country, 'name' : name, 'identification' : identification, 'sector' : sector},
                success: function (response) {
                    if (response.status == 'ok') {
                        selectingCompany(response.name, response.id);
                    } else {
                        flashMessages({'type': 'error', 'message': response.message});
                    }
                    $("#btnRegisterCompany").removeAttr("disabled");
                }
            });
        }
    }
    else{
        flashMessages({'type': 'error', 'message': 'Todos los campos son requeridos' });
    }
}

function formCompanyShowRegisterForm(){
    $('#formRegisterForm').removeClass('visually-hidden');
    $('#btnShowRegisterButton').addClass('visually-hidden');
}