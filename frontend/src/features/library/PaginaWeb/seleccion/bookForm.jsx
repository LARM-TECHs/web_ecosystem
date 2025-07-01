export default function BookForm({ nuevoLibro, handleChange, agregarLibro }) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-4">Agregar Nuevo Libro</h2>
        <form onSubmit={agregarLibro} className="grid gap-4">
          <div>
            <label className="block font-medium mb-2">Libro</label>
            <input
              type="text"
              name="book"
              value={nuevoLibro.book}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-2">Autor</label>
            <input
              type="text"
              name="author"
              value={nuevoLibro.author}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-2">Editorial</label>
            <input
              type="text"
              name="publisher"
              value={nuevoLibro.publisher}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-2">Cantidad</label>
            <input
              type="number"
              name="quantity"
              value={nuevoLibro.quantity}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white rounded p-2 hover:bg-blue-600"
          >
            Agregar Libro
          </button>
        </form>
      </div>
    );
  }