// CoordenadasGanadoras.js

class CoordenadasGanadoras {
    constructor() {
      this.coordenadas = [];
    }
  
    getCoordenadas() {
      return this.coordenadas
    }

    //coordenada formato: [x, y]
    setCoordenadas(coordenada1, coordenada2, coordenada3)
    {
        this.coordenadas = [coordenada1, coordenada2, coordenada3];
    }
}