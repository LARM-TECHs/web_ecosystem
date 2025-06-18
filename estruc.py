import os

def listar_estructura_carpeta(ruta):
    for carpeta_raiz, carpetas, archivos in os.walk(ruta):
        nivel = carpeta_raiz.replace(ruta, '').count(os.sep)
        indentacion = ' ' * 4 * (nivel)
        print(f"{indentacion}{os.path.basename(carpeta_raiz)}/")
        for archivo in archivos:
            print(f"{indentacion}    {archivo}")

# Cambia 'tu_ruta_aqui' por la ruta de la carpeta que deseas explorar
listar_estructura_carpeta('C:/Users/user/Documents/VSCode Files/JavaScript/WebAI/web_ecosystem')
