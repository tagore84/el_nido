import sys

"""
Responsabilidad:
- Comparar un workflow local exportado con la versión en Git
- Ignorar cambios triviales (posiciones de nodos UI)
- Reportar cambios sustanciales en lógica o parámetros
"""

def diff_workflow(local_file, git_file):
    print(f"Diff {local_file} vs {git_file}")
    pass

if __name__ == "__main__":
    diff_workflow("local.json", "git.json")
