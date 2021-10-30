window.onload =  function(){
                n = 3;
                if(n == 3){
                    set_problem_values();
                    createTable();
                }
}

function create_inputs(){}

function set_problem_values() {
    coef = [
        [2, 3, -1, 16],
        [1, -2, 3, -13],
        [2, -4, -2, -10]
    ];
    for (i = 1; i <= 3; i++) {
        eq = document.getElementById(`eq${i}`)
        for (j = 1; j <= 3; j++) {
            eq.querySelector(`input[name='x${j}']`).value = coef[i - 1][j - 1];
        }
        eq.querySelector(`input[name='result']`).value = coef[i - 1][3];
    }

    initial_points = [0, 1, -2];
    initial_div = document.getElementById("initial");
    for (i = 1; i <= 3; i++) {
        initial_div.querySelector(`input[name='x${i}']`).value = initial_points[i - 1];
    }

    error = 10;
    document.getElementsByName("error")[0].value = error;
}

function get_initial(dis) {
    initial = document.getElementById(`initial`)
    for (i = 1; i <= 3; i++) {
        v = parseInt(initial.querySelector(`input[name='x${i}']`).value);
        dis.old_v.push(v);
    }

    dis.error = parseInt(document.getElementsByName("error")[0].value)/100;
}

function get_cof(dis) {
    cof = [];

    for (i = 1; i <= 3; i++) {
        eq = document.getElementById(`eq${i}`)
        eq_cof = [];
        for (j = 1; j <= 3; j++) {
            v = parseInt(eq.querySelector(`input[name='x${j}']`).value);
            eq_cof.push(v);
        }
        v = parseInt(eq.querySelector(`input[name='result']`).value);
        eq_cof.push(v);
        dis.cof.push(eq_cof);
    }
}


function iterate_method(dis, _class) {

    function create_rows(values) {
        round = n => Math.round(n*100)/100
        rows = ``;
        for (v of values) {
            rows += `<td class=${_class}>${round(v)}</sub></td>`
        }
        return rows
    }

    function more_than_target_error(){
        for(error of errors){
            if(error >= dis.error){
                return true
            }
        }
        return false;
    }

    dis.new_v = dis.old_v.slice()

    n_iteration=1;
    do{
        errors = [];
        for (i = 0; i < 3; i++) {
            dis.new_v[i] = (dis.cof[i][3] - dis.cof[i][(i + 1) % 3] * dis.new_v[(i + 1) % 3] - dis.cof[i][(i + 2) % 3] * dis.new_v[(i + 2) % 3]) / dis.cof[i][i]
            errors.push(Math.abs((dis.new_v[i] - dis.old_v[i]) / dis.new_v[i]));
        }
        dis.old_v = dis.new_v.slice();
        dis.trow += `
        <tr>
            <td>${n_iteration++}</td>
            ${create_rows(dis.new_v)}
            ${create_rows(errors, _class="error_column")}
        </tr>`
    }while(more_than_target_error());
}

function createTable() {

    state = {
        old_v: [],
        error: undefined,
        cof: [],
        new_v: [],
        thead: `<table style="width:100%">
        <thead>
            <tr>
                <th>iteracion</th>
                <th>x<sub>1</sub></th>
                <th>x<sub>2</sub></th>
                <th>x<sub>3</sub></th>
                <th class="error-column">error x<sub>1</sub></th>
                <th class="error-column">error x<sub>2</sub></th>
                <th class="error-column">error x<sub>3</sub></th>
            </tr>
        </thead>`,
        trow: ``,
        ttail: `</table>`,
        get_table: function () {
            return this.thead+this.trow+this.ttail
        }
    }

    get_initial(state);

    get_cof(state);

    iterate_method(state);

    document.getElementById("table-container").innerHTML = state.get_table();
}
