import json
from ortools.linear_solver import pywraplp


def create_data_model():
    """Create the data for the example."""
    data = {}
    widths = [48, 30, 19, 36, 36, 27, 42, 42, 36, 24, 30]
    data['widths'] = widths
    data['gameID'] = list(range(len(widths)))
    data['cubes'] = data['gameID']
    data['cube_capacity'] = 100
    
    print(data)
    with open('data.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    return data



def main():
    data = create_data_model()

    # Create the mip solver with the SCIP backend.
    solver = pywraplp.Solver.CreateSolver('SCIP')


    # Variables
    # x[i, j] = 1 if item i is packed in bin j.
    x = {}
    for i in data['gameID']:
        for j in data['cubes']:
            x[(i, j)] = solver.IntVar(0, 1, 'x_%i_%i' % (i, j))

    # y[j] = 1 if bin j is used.
    y = {}
    for j in data['cubes']:
        y[j] = solver.IntVar(0, 1, 'y[%i]' % j)

    # Constraints
    # Each item must be in exactly one bin.
    for i in data['gameID']:
        solver.Add(sum(x[i, j] for j in data['cubes']) == 1)

    # The amount packed in each bin cannot exceed its capacity.
    for j in data['cubes']:
        solver.Add(
            sum(x[(i, j)] * data['widths'][i] for i in data['gameID']) <= y[j] *
            data['cube_capacity'])

    # Objective: minimize the number of bins used.
    solver.Minimize(solver.Sum([y[j] for j in data['cubes']]))

    status = solver.Solve()

    if status == pywraplp.Solver.OPTIMAL:
        num_cubes = 0.
        for j in data['cubes']:
            if y[j].solution_value() == 1:
                bin_games = []
                bin_width = 0
                for i in data['gameID']:
                    if x[i, j].solution_value() > 0:
                        bin_games.append(i)
                        bin_width += data['widths'][i]
                if bin_width > 0:
                    num_cubes += 1
                    print('Cube number', j)
                    print('  Games packed:', bin_games)
                    print('  Total Width:', bin_width)
                    print()
        print()
        print('Number of cubes used:', num_cubes)
        print('Time = ', solver.WallTime(), ' milliseconds')
    else:
        print('The problem does not have an optimal solution.')


if __name__ == '__main__':
    main()

