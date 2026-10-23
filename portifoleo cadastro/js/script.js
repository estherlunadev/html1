
document.addEventListener("DOMContentLoaded", function () {

    // Campos do formulário
    const form = document.getElementById("formCadastro");
    const nome = document.getElementById("nome");
    const cargo = document.getElementById("cargo");
    const resumo = document.getElementById("resumo");

    // Visualização do currículo
    const nomePreview = document.getElementById("nomePreview");
    const cargoPreview = document.getElementById("cargoPreview");
    const resumoPreview = document.getElementById("resumoPreview");

    // Botões
    const btnLimpar = document.getElementById("btnLimpar");
    const btnTema = document.getElementById("btnTema");

    // Criar área para listar os perfis salvos
    const listaPerfis = document.createElement("div");
    listaPerfis.id = "listaPerfis";
    listaPerfis.innerHTML = "<h3>Perfis salvos</h3>";
    form.insertAdjacentElement("afterend", listaPerfis);

    // Recuperar cadastros salvos
    let perfis = JSON.parse(
        localStorage.getItem("perfisProfissionais") || "[]"
    );

    let perfilEditando = null;

    // Atualizar visualização do currículo
    function atualizarVisualizacao(perfil) {
        nomePreview.textContent = perfil.nome || "Seu Nome";
        cargoPreview.textContent = perfil.cargo || "Cargo Desejado";
        resumoPreview.textContent =
            perfil.resumo || "Seu resumo profissional aparecerá aqui.";
    }

    // Limpar campos do formulário
    function limparFormulario() {
        form.reset();
        perfilEditando = null;

        atualizarVisualizacao({
            nome: "",
            cargo: "",
            resumo: ""
        });
    }

    // Salvar lista de perfis no navegador
    function guardarPerfis() {
        localStorage.setItem(
            "perfisProfissionais",
            JSON.stringify(perfis)
        );
    }

    // Mostrar perfis salvos
    function mostrarPerfis() {
        listaPerfis.innerHTML = "<h3>Perfis salvos</h3>";

        if (perfis.length === 0) {
            listaPerfis.innerHTML +=
                "<p>Nenhum perfil cadastrado.</p>";
            return;
        }

        perfis.forEach(function (perfil, indice) {
            const item = document.createElement("div");
            item.style.marginBottom = "12px";

            const titulo = document.createElement("strong");
            titulo.textContent = perfil.nome || "Perfil sem nome";

            const btnAbrir = document.createElement("button");
            btnAbrir.type = "button";
            btnAbrir.textContent = "Abrir";
            btnAbrir.addEventListener("click", function () {
                nome.value = perfil.nome;
                cargo.value = perfil.cargo;
                resumo.value = perfil.resumo;

                perfilEditando = indice;
                atualizarVisualizacao(perfil);
            });

            const btnExcluir = document.createElement("button");
            btnExcluir.type = "button";
            btnExcluir.textContent = "Excluir";
            btnExcluir.addEventListener("click", function () {
                if (confirm("Deseja excluir este perfil?")) {
                    perfis.splice(indice, 1);
                    guardarPerfis();
                    limparFormulario();
                    mostrarPerfis();
                }
            });

            item.append(titulo, document.createTextNode(" "), btnAbrir, btnExcluir);
            listaPerfis.appendChild(item);
        });
    }

    // Salvar ou atualizar perfil
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const perfil = {
            nome: nome.value.trim(),
            cargo: cargo.value.trim(),
            resumo: resumo.value.trim()
        };

        if (perfilEditando !== null) {
            perfis[perfilEditando] = perfil;
        } else {
            perfis.push(perfil);
        }

        guardarPerfis();
        atualizarVisualizacao(perfil);
        limparFormulario();
        mostrarPerfis();

        alert("Perfil salvo com sucesso!");
    });

    // Limpar os campos sem apagar os cadastros salvos
    btnLimpar.addEventListener("click", function () {
        limparFormulario();
    });

    // Alternar tema claro e escuro
    function aplicarTema(tema) {
        const escuro = tema === "escuro";

        document.body.classList.toggle("modo-noturno", escuro);
        btnTema.textContent = escuro ? "Modo Claro" : "Modo Escuro";

        localStorage.setItem("tema", tema);
    }

    btnTema.addEventListener("click", function () {
        const escuroAtivo =
            document.body.classList.contains("modo-noturno");

        aplicarTema(escuroAtivo ? "claro" : "escuro");
    });

    // Restaurar tema escolhido
    aplicarTema(localStorage.getItem("tema") || "claro");

    // Restaurar os perfis salvos
    mostrarPerfis();

});
