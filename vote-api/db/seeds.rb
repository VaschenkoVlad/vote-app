# Clear existing data
Poll.destroy_all

# Create test polls
poll = Poll.create!(title: "What is your favorite language?")
poll.votes.create!(option: "Ruby")
poll.votes.create!(option: "JavaScript")
poll.votes.create!(option: "Python")

Poll.create!(
  title: "Найкращий фронтенд фреймворк?",
  options: ["React", "Vue", "Angular"]
)
