export class SphericalCalculator {

    static toRad(value) {
        return (value * Math.PI) / 180;
    }

    static computeDistanceBetween(lat1, lon1, lat2, lon2) {
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);

        const latRad1 = this.toRad(lat1);
        const latRad2 = this.toRad(lat2);

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
            + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(latRad1) * Math.cos(latRad2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return 6371000 * c;
    }

    static computeDistanceBetween2(p1, p2) {
        return SphericalCalculator.computeDistanceBetween(p1[0], p1[1], p2[0], p2[1]);
    }
}
