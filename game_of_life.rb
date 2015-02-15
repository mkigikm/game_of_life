class GameOfLife
  DELTAS = [
    [-1, -1],
    [-1,  0],
    [-1,  1],
    [ 0, -1],
    [ 0,  1],
    [ 1, -1],
    [ 1,  0],
    [ 1,  1]
  ]

  attr_reader :underpop, :overpop, :born

  def neighbor(row, col, delta)
    row = (row + delta[0]) % rows
    col = (col + delta[1]) % cols
    # puts row
    # puts col
    @grid[row][col]
  end

  def initialize(rows, cols, underpop = 2, overpop = 3, born = 3)
    @grid     = Array.new(rows) { Array.new(cols) { 0 } }
    @underpop = underpop
    @overpop  = overpop
    @born = born
  end

  def []=((row, col), value)
    @grid[row][col] = value & 1
  end

  def randomize(p=0.1)
    rows.times do |row|
      cols.times do |col|
        @grid[row][col] = rand < p ? 1 : 0
      end
    end

    self
  end

  def rows
    @grid.count
  end

  def cols
    @grid.first.count
  end

  def next_generation
    count_neighbors
    birth_next_generation
    self
  end

  def count_neighbors
    rows.times do |row|
      cols.times do |col|
        neighbors = DELTAS.inject(0) do |total, delta|
          total + (neighbor(row, col, delta) & 1)
        end
        @grid[row][col] += 2 * neighbors
      end
    end

    self
  end

  def birth_next_generation
    rows.times do |row|
      cols.times do |col|
        value = @grid[row][col]
        neighbors = value / 2
        alive = value & 1 == 1

        if alive
          @grid[row][col] = neighbors.between?(underpop, overpop) ? 1 : 0
        else
          @grid[row][col] = neighbors == born ? 1 : 0
        end
      end
    end

    self
  end

  def inspect
    @grid.map(&:join).join("\n")
  end
end
