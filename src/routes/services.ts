import Machine from "@Classes/Machine";
import Route from "@Classes/Route";

export default new Route("/services", "get", (req, res) => {
    let machines: Machine[] = Array.from(global.container.getMachines().values());
    machines.map(machine => machine.toJSON());
    res.send(machines);
})

